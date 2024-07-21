import { defineConfig } from 'nitro-test-utils/config'
import { resolvePathSync } from 'mlly'
import { dirname } from 'pathe'

export default defineConfig({
    nitro: {
        rootDir: dirname(resolvePathSync('./fixtures/basic/nitro.config.ts', {
            url: import.meta.url
        })),
    }
})