import { defineNitroConfig } from 'nitropack/config'
import '../../../src/augment'
import { resolve } from 'pathe'

export default defineNitroConfig({
  modules: [
      'nitro-opentelemetry'
  ],

  otel: {
      preset: {
          name: 'custom',
          filePath: ('./init.ts')
      }
  },

  compatibilityDate: '2025-01-09'
})