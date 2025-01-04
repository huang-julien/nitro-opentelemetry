//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  modules: [
    '../src/module.ts'
  ],
  experimental: {
    asyncContext: true
  },
  compatibilityDate: '2025-01-03'
});
