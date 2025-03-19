import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
     'dist/',
    '**/.nitro/**',
    '.nitro/**',
    '**/.output/**'
  ],
  rules: {
    // rule overrides
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
