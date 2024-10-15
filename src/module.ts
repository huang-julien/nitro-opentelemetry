import type { NitroModule } from 'nitropack'
 import { Plugin, rollup } from "rollup"

export default <NitroModule>{
    async setup(nitro){
        nitro.hooks.hook('rollup:before', (nitro, rollupConfig) => {
            if(!rollupConfig.plugins) rollupConfig.plugins = []
            // @ts-ignore
            rollupConfig.plugins.push(injectInitPlugin())
        })
    }
}


const INIT_IMPORT = `import 'nitro-opentelemetry/runtime/init';`

function injectInitPlugin(): Plugin {
    return {
        name: 'inject-init-plugin',
        renderChunk(code, chunk) {
            const isEntry = chunk.isEntry;
            if (!isEntry) return;
           
            return {
              code: INIT_IMPORT + code
            };
          },
    }
}