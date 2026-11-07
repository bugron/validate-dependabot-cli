import { expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateDependabotYaml } from '../src/validateDependabotYaml.js';

test('validates cooldown using the bundled schema', async () => {
    const config = readFileSync(
        '__tests__/configs/success/cooldown.yml',
        'utf-8',
    );

    expect(await validateDependabotYaml(config)).toEqual({
        message: 'success',
    });
});
