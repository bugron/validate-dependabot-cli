import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['src/run.ts'],
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  minify: true,
  dts: false,
  splitting: false
})
