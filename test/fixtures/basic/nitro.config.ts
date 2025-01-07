import { defineNitroConfig } from 'nitropack/config'
import '../../../src/augment'

export default defineNitroConfig({
    modules: [
        'nitro-opentelemetry'
    ],
    otel: {
        preset: {
            name: 'node'
        }
    }
})
