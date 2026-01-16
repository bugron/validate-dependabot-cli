import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/run.ts'],
    format: ['esm'],
    target: 'node20',
    platform: 'node',
    outDir: 'dist',
    clean: true,
    minify: false,
    unbundle: false,
    dts: false,
});
