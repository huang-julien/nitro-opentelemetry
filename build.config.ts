import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src/runtime',
      outDir: './dist/runtime',
      format: 'esm'
    },
    {
      builder: 'rollup',
      input: './src/index.ts'
    },
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: ['#imports'],
})
