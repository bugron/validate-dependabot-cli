import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            exclude: [
                '**/cli.ts',
                '**/run.ts',
                ...coverageConfigDefaults.exclude,
            ],
        },
    },
});
