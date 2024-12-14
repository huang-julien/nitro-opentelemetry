import type { NitroModule } from 'nitropack'
import type { Plugin } from "rollup"
import { presets } from './imports'
import { resolvePath } from 'mlly'
import MagicString from 'magic-string'
import { getPresetFile, isPresetEntry } from './presets'
import { normalize } from "pathe"

export default <NitroModule>{
    async setup(nitro) {
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
                    if (normalizedId.includes('runtime/entries')) { 
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


        if (nitro.options.imports) {
            nitro.options.imports.presets.push(presets)
        }

        nitro.options.plugins.push(await resolvePath('nitro-opentelemetry/runtime/plugin', {
            extensions: ['.mjs', '.ts']
        }))
    }
}
