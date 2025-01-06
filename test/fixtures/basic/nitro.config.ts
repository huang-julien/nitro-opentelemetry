import { defineNitroConfig } from 'nitropack/config'

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
