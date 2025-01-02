import { defineConfig } from 'nitro-test-utils/config'

export default defineConfig({
    nitro: {
        global: {
            rootDir: 'test/fixtures/basic'
        }
    }
})