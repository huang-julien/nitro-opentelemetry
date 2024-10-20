import { resolvePath } from "mlly";
import type { Nitro } from "nitropack";
import { logger } from "./logger";

export async function getPresetFile(nitro: Nitro) {
    if(nitro.options.openTelemetry?.configFilePath) {
        return await resolvePath(nitro.options.openTelemetry.configFilePath, {
            extensions: ['.mjs', '.ts'],
            url: process.cwd()
        })
    }

    const nitroPreset = nitro.options.preset

    switch (nitroPreset) {
        case 'node':
        case 'node-cluster':
        case 'node-server': {
            return await resolvePath('nitro-opentelemetry/presets/node', {
                extensions: ['.mjs', '.ts']
            })
        }
    }

    logger.warn(`Initializer file for preset ${nitroPreset} not found. Please provide your own or open an issue on the repository.`)
    return ''
}