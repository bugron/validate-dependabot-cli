import { describe, expect, test } from 'vitest';
import { validateDependabotYaml } from '../src/validateDependabotYaml.js';
import v2Schema from './dependabot-2.0.json' with { type: 'json' };

const configWithGroups = (groups: string): string => `version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    groups:
${groups}
`;

const aliasFailure = {
    message: 'failure',
    errors: [
        {
            keyword: 'yamlAliases',
            dataPath: '',
            schemaPath: '#/yamlAliases',
            params: {},
            message: 'YAML aliases are not supported',
        },
    ],
};

describe('YAML aliases', () => {
    test.each([
        [
            'sequence',
            '      first:\n        patterns: &patterns [typescript]\n      second:\n        patterns: *patterns',
        ],
        [
            'mapping',
            '      first: &group\n        patterns: [typescript]\n      second: *group',
        ],
        [
            'scalar',
            '      first:\n        patterns: [&pattern typescript]\n      second:\n        patterns: [*pattern]',
        ],
        [
            'mapping key',
            '      first:\n        patterns: [&pattern typescript]\n      second:\n        *pattern : [typescript]',
        ],
        ['recursive', '      first: &group\n        patterns: [*group]'],
        ['unresolved', '      first:\n        patterns: *missing'],
    ])('rejects %s aliases with a validation error', async (_name, groups) => {
        expect(
            await validateDependabotYaml(configWithGroups(groups), v2Schema),
        ).toEqual(aliasFailure);
    });

    test.each([
        [
            'explicit arrays',
            '      first:\n        patterns: [typescript]\n      second:\n        patterns: [typescript]',
        ],
        [
            'unused anchor',
            '      first:\n        patterns: &patterns [typescript]',
        ],
        [
            'quoted alias text',
            '      first:\n        patterns: ["*patterns", \'*other\', "&anchor"]',
        ],
        [
            'comment',
            '      first:\n        patterns: [typescript] # *patterns &anchor',
        ],
    ])('accepts %s', async (_name, groups) => {
        expect(
            await validateDependabotYaml(configWithGroups(groups), v2Schema),
        ).toEqual({ message: 'success' });
    });

    test('continues to reject malformed YAML', async () => {
        await expect(
            validateDependabotYaml('updates: [', v2Schema),
        ).rejects.toThrow();
    });

    test('continues to reject multiple documents', async () => {
        await expect(
            validateDependabotYaml('version: 2\n---\nversion: 2', v2Schema),
        ).rejects.toThrow();
    });
});
