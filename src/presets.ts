import { resolvePath } from "mlly";
import type { Nitro } from "nitropack";
import { logger } from "./logger";

export async function getPresetFile(nitro: Nitro) {
    if (nitro.options.otel?.preset === false) {
        return ''
    }

    if (nitro.options.otel?.preset?.name === 'custom') {
        return await resolvePath(nitro.options.otel.preset.filePath, {
            extensions: ['.mjs', '.ts'],
            url: process.cwd()
        })
    }

    const nitroPreset = nitro.options.otel?.preset?.name || nitro.options.preset

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
        case 'baselime-cf-worker': {
            return await resolvePath('nitro-opentelemetry/runtime/presets/baselime-cf-worker', {
                extensions: ['.mjs', '.ts']
            })
        }
    }

    logger.warn(`Initializer file for preset ${nitroPreset} not found. Please provide your own or open an issue on the repository.`)
    return ''
}

/**
 * return true if the preset file is an entry file
 * for example: baselime-cf-worker is re-exporting the entry file because it wraps the entry file with @microlabs/otel-cf-workers
 */
export function isPresetEntry(nitro: Nitro) {
    const preset = (nitro.options.otel?.preset ? nitro.options.otel?.preset.name : undefined) || nitro.options.preset
    return ['baselime-cf-worker'].includes(preset)
}