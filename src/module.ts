import type { NitroModule } from 'nitropack'
import type { Plugin } from "rollup"
import { presets } from './imports'
import { resolvePath } from 'mlly'
import MagicString from 'magic-string'

export default <NitroModule>{
    async setup(nitro) {
        nitro.hooks.hook('rollup:before', (nitro, rollupConfig) => {
            if (!rollupConfig.plugins) rollupConfig.plugins = []
            // @ts-ignore
            rollupConfig.plugins.push(injectInitPlugin())
        })

        nitro.options.alias['#nitro-opentelemetry/init'] = await resolvePath('nitro-opentelemetry/runtime/init', {
            extensions: ['.mjs', '.ts']
        })

        if (nitro.options.imports) {
            nitro.options.imports.presets.push(presets)
        }

        nitro.options.plugins.push(await resolvePath('nitro-opentelemetry/runtime/plugin', {
            extensions: ['.mjs', '.ts']
        })
)
    }
}

function injectInitPlugin(): Plugin {
    return {
        name: 'inject-init-plugin',
        async transform(code, id) {
            if (id.includes(String.raw`runtime\entries`)) {
                const s = new MagicString(code)
                s.prepend(`import '#nitro-opentelemetry/init';`)
                return {
                    code: s.toString(),
                    map: s.generateMap({ hires: true }),
                    moduleSideEffects: true
                }
            }

            if (id.includes(String.raw`runtime\init`)) {
                return { code, moduleSideEffects: true }
            }
        },
    }
}
