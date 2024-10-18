import type { NitroModule } from 'nitropack'
import type { Plugin } from "rollup"
import { presets } from './imports'
import { resolvePath } from 'mlly'

export default <NitroModule>{
    async setup(nitro) {
        nitro.hooks.hook('rollup:before', (nitro, rollupConfig) => {
            if (!rollupConfig.plugins) rollupConfig.plugins = []
            // @ts-ignore
            rollupConfig.plugins.push(injectInitPlugin())
        })

        if (nitro.options.imports) {
            nitro.options.imports.presets.push(presets)
        }
    }
}

function injectInitPlugin(): Plugin {
    return {
        name: 'inject-init-plugin',
        async transform(code, id) {
            const moduleInfo = this.getModuleInfo(id)
            if (moduleInfo?.isEntry) {
                return {
                    code: [`import '${await resolvePath('nitro-opentelemetry/runtime/init', { extensions: ['.js', '.mjs', '.cjs'] })}'`, code].join('\n')
                }
            }
        },
    }
}