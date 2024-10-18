import type { Preset } from 'unimport'
import { resolvePathSync } from "mlly"

export const presets: Preset = {
    package: resolvePathSync('nitro-opentelemetry/runtime/utils', {
        extensions: ['.mjs', '.ts']
    })
}