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
    }
}

function injectInitPlugin(): Plugin {
    return {
        name: 'inject-init-plugin',
        async transform(code, id) {
            const moduleInfo = this.getModuleInfo(id)
             if (moduleInfo?.isEntry) {
                const s = new MagicString(code)
                s.prepend(`import '#nitro-opentelemetry/init';`)
                s.prepend(`console.log('wtf');`)
                  return {
                    code: s.toString(),
                    map: s.generateMap({ hires: true }), 
                }
            } 
        },
    }
}
