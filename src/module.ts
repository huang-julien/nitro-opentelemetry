import type { NitroModule } from 'nitropack'
import { resolvePath } from "mlly"

export default <NitroModule>{
    async setup(nitro){
        nitro.options.plugins.push(await resolvePath('nitro-opentelemetry/runtime/plugin', {
            extensions: ['.ts', '.mjs', '.js']
        }))       
    }
}