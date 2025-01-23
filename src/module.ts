import type { Nitro } from 'nitropack'
import type { Plugin } from "rollup"
import { presets } from './imports'
import { resolvePath } from 'mlly'
import MagicString from 'magic-string'
import { getPresetFile, isPresetEntry } from './presets'
import { normalize } from "pathe"
import type { Nuxt } from "@nuxt/schema"

async function module(nitro: Nitro) {
    nitro.options.alias['#nitro-opentelemetry/init'] = await getPresetFile(nitro)

    if(isPresetEntry(nitro)) {
        nitro.options.alias['#nitro-entry-file'] = nitro.options.entry
        nitro.options.entry = await getPresetFile(nitro)
    }

    nitro.hooks.hook('rollup:before', (nitro, rollupConfig) => {
        if (!rollupConfig.plugins) rollupConfig.plugins = [];
        const plugins = rollupConfig.plugins
        if(Array.isArray(plugins)) {
            rollupConfig.plugins = plugins.filter((plugin) => {
                if( plugin && 'name' in plugin) {
                    // workaround for while waiting for configurable impound settings in nuxt
                    return plugin.name!== 'impound'
                }
                return true
            });
        }

         (rollupConfig.plugins as Plugin[]).push({
            name: 'inject-init-plugin',
            async transform(code, id) {
                const normalizedId = normalize(id)  
                 // transform nitro entry file but there's probably a better way
                if (normalizedId.includes('runtime/entries') || this.getModuleInfo(id)?.isEntry ) { 
                    const s = new MagicString(code)
                    s.prepend(`import '#nitro-opentelemetry/init';`)
                 
                    return {
                        code: s.toString(),
                        map: s.generateMap({ hires: true }),
                        moduleSideEffects: true
                    }
                } 
                //  @todo find another way to mark it as side effect :/
                if (normalizedId === nitro.options.alias['#nitro-opentelemetry/init']) {
                    const s = new MagicString(code)
                    return {
                        moduleSideEffects: true, 
                        code: s.toString(),
                        map: s.generateMap({ hires: true }),
                    }
                }
            },
        })
    })

    nitro.options.virtual['#nitro-otel-options'] = nitro.options.otel?.preset && typeof nitro.options.otel.preset === 'object' && 'options' in nitro.options.otel.preset ? `export default ${JSON.stringify(nitro.options.otel.preset.options || {})}` : `export default {}`;

    if (nitro.options.imports) {
        nitro.options.imports.presets.push(presets)
    }

    if (nitro.options.renderer) {
        nitro.options.alias['#nitro-renderer'] = nitro.options.renderer
        nitro.options.renderer = await resolvePath('nitro-opentelemetry/runtime/renderer/renderer', {
            extensions: ['.mjs', '.ts']
        })
    }

    if (nitro.options.errorHandler) {
        nitro.options.alias['#nitro-error-handler'] = nitro.options.errorHandler
        nitro.options.errorHandler = await resolvePath('nitro-opentelemetry/runtime/renderer/error', {
            extensions: ['.mjs', '.ts']
        })
    } 

    nitro.options.plugins.push(await resolvePath('nitro-opentelemetry/runtime/plugin', {
        extensions: ['.mjs', '.ts']
    }))
}

// Dual compatibility with Nuxt and Nitro Modules
export default function moduleWithCompat(arg1: unknown, arg2: unknown) {
    if ((arg2 as Nuxt)?.options?.nitro) {
      (arg2 as Nuxt).hooks.hookOnce("nitro:config", (nitroConfig) => {
        nitroConfig.modules = nitroConfig.modules || [];
        nitroConfig.modules.push(module);
      });
    } else {
      module(arg1 as Nitro);
    }
  }