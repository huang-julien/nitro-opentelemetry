import { resolvePath } from "mlly";
import type { Nitro } from "nitropack";
import { logger } from "./logger";
import { isAbsolute } from "pathe";

export async function getPresetFile(nitro: Nitro) {
    if(nitro.options.openTelemetry?.configFile && isAbsolute(nitro.options.openTelemetry?.configFile) ) {
        return await resolvePath(nitro.options.openTelemetry.configFile, {
            extensions: ['.mjs', '.ts'],
            url: process.cwd()
        })
    }

    if(nitro.options.openTelemetry?.configFile === false) {
        return ''
    }

    const nitroPreset =nitro.options.openTelemetry?.configFile || nitro.options.preset

    switch (nitroPreset) {
        case 'node':
        case 'node-cluster':
        case 'nitro-dev':
        case 'node-server': {
            return await resolvePath('nitro-opentelemetry/runtime/presets/node', {
                extensions: ['.mjs', '.ts'] 
            })
        }
        case 'azure-monitor': {
            return await resolvePath('nitro-opentelemetry/runtime/presets/azure-monitor', {
                extensions: ['.mjs', '.ts'] 
            })
        }
        case 'baselime-node': {
            return await resolvePath('nitro-opentelemetry/runtime/presets/baselime-node', {
                extensions: ['.mjs', '.ts']
            })
        }
    }

    logger.warn(`Initializer file for preset ${nitroPreset} not found. Please provide your own or open an issue on the repository.`)
    return ''
}