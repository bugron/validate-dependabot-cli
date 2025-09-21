import { test, describe, expect, vi } from 'vitest';

import path from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';
import { validateDependabotYaml } from '../src/validateDependabotYaml.js';
import v2Schema from './dependabot-2.0.json' with { type: 'json' };

vi.mock('../src/fetchSchema.js', () => ({
    fetchSchema: () => v2Schema,
}));

const readConfig = (configPath: string): string =>
    readFileSync(path.join(process.cwd(), configPath), 'utf-8');

describe('validateDependabot', () => {
    describe('with no errors', () => {
        const successConfigs = readdirSync('__tests__/configs/success')
            .filter(file => !file.includes('error'))
            .map(file => `__tests__/configs/success/${file}`);

        test.each(['.github/dependabot.yml', ...successConfigs])(
            '%s',
            async configPath => {
                const config = readConfig(configPath);

                expect(await validateDependabotYaml(config, v2Schema)).toEqual({
                    message: 'success',
                });
            },
        );
    });

    test('with errors: __tests__/configs/dependabot-error.yml, fetches schema', async () => {
        const errorConfig = readConfig(
            '__tests__/configs/dependabot-error.yml',
        );

        expect(await validateDependabotYaml(errorConfig)).toEqual({
            message: `failure`,
            errors: [
                {
                    keyword: 'maxLength',
                    dataPath: ".updates[0]['commit-message'].prefix",
                    schemaPath:
                        '#/properties/commit-message/properties/prefix/maxLength',
                    params: {
                        limit: 50,
                    },
                    message: 'should NOT be longer than 50 characters',
                },
                {
                    keyword: 'required',
                    dataPath: '.updates[0]',
                    schemaPath: '#/allOf/0/required',
                    params: {
                        missingProperty: 'schedule',
                    },
                    message: "should have required property 'schedule'",
                },
                {
                    keyword: 'required',
                    dataPath: '.updates[0]',
                    schemaPath: '#/allOf/1/oneOf/0/required',
                    params: {
                        missingProperty: 'directories',
                    },
                    message: "should have required property 'directories'",
                },
                {
                    keyword: 'required',
                    dataPath: '.updates[0]',
                    schemaPath: '#/allOf/1/oneOf/1/required',
                    params: {
                        missingProperty: 'directory',
                    },
                    message: "should have required property 'directory'",
                },
                {
                    keyword: 'oneOf',
                    dataPath: '.updates[0]',
                    schemaPath: '#/allOf/1/oneOf',
                    params: {
                        passingSchemas: null,
                    },
                    message: 'should match exactly one schema in oneOf',
                },
                {
                    keyword: 'maxLength',
                    dataPath:
                        ".updates[1]['commit-message']['prefix-development']",
                    schemaPath:
                        '#/properties/commit-message/properties/prefix-development/maxLength',
                    params: {
                        limit: 50,
                    },
                    message: 'should NOT be longer than 50 characters',
                },
                {
                    keyword: 'required',
                    dataPath: '.updates[1]',
                    schemaPath: '#/allOf/0/required',
                    params: {
                        missingProperty: 'schedule',
                    },
                    message: "should have required property 'schedule'",
                },
                {
                    keyword: 'required',
                    dataPath: '.updates[1]',
                    schemaPath: '#/allOf/1/oneOf/0/required',
                    params: {
                        missingProperty: 'directories',
                    },
                    message: "should have required property 'directories'",
                },
                {
                    keyword: 'required',
                    dataPath: '.updates[1]',
                    schemaPath: '#/allOf/1/oneOf/1/required',
                    params: {
                        missingProperty: 'directory',
                    },
                    message: "should have required property 'directory'",
                },
                {
                    keyword: 'oneOf',
                    dataPath: '.updates[1]',
                    schemaPath: '#/allOf/1/oneOf',
                    params: {
                        passingSchemas: null,
                    },
                    message: 'should match exactly one schema in oneOf',
                },
                {
                    keyword: 'customError',
                    dataPath: '.updates',
                    schemaPath: '#/customError',
                    params: {
                        propertyName: 'customError',
                    },
                    message:
                        "Update configs must have a unique combination of 'package-ecosystem', 'directory', and 'target-branch'",
                },
            ],
        });
    });

    test.each([
        ['__tests__/configs/dependabot-error-unique-combination-1.yml'],
        ['__tests__/configs/dependabot-error-unique-combination-2.yml'],
    ])(`with unique combination error: %s`, async configPath => {
        const config = readConfig(configPath);

        expect(await validateDependabotYaml(config, v2Schema)).toEqual({
            message: `failure`,
            errors: [
                {
                    keyword: 'customError',
                    dataPath: '.updates',
                    schemaPath: '#/customError',
                    params: {
                        propertyName: 'customError',
                    },
                    message:
                        "Update configs must have a unique combination of 'package-ecosystem', 'directory', and 'target-branch'",
                },
            ],
        });
    });

    test('with errors: __tests__/configs/dependabot-error-dependency-type-groups.yml', async () => {
        const errorConfig = readConfig(
            '__tests__/configs/dependabot-error-dependency-type-groups.yml',
        );

        expect(await validateDependabotYaml(errorConfig)).toEqual({
            message: `failure`,
            errors: [
                {
                    keyword: 'customError',
                    dataPath: '.dependency-type',
                    schemaPath: '#/customError',
                    params: {
                        propertyName: 'customError',
                    },
                    message:
                        "'dependency-type' option is only supported for the following package ecosystems: bundler,composer,mix,maven,npm,pip",
                },
            ],
        });
    });

    test('with errors: __tests__/configs/dependabot-error-cooldown-semver.yml', async () => {
        const errorConfig = readConfig(
            '__tests__/configs/dependabot-error-cooldown-semver.yml',
        );

        expect(await validateDependabotYaml(errorConfig)).toEqual({
            message: `failure`,
            errors: [
                {
                    keyword: 'unsupportedCooldownSemVer',
                    dataPath: '/updates/0/cooldown/semver-major-days',
                    message:
                        "The 'semver-major-days' option in 'cooldown' is not supported for the 'devcontainers' package ecosystem.",
                    params: {},
                    schemaPath: '#/customError',
                },
                {
                    dataPath: '/updates/0/cooldown/semver-minor-days',
                    keyword: 'unsupportedCooldownSemVer',
                    message:
                        "The 'semver-minor-days' option in 'cooldown' is not supported for the 'devcontainers' package ecosystem.",
                    params: {},
                    schemaPath: '#/customError',
                },
                {
                    dataPath: '/updates/0/cooldown/semver-patch-days',
                    keyword: 'unsupportedCooldownSemVer',
                    message:
                        "The 'semver-patch-days' option in 'cooldown' is not supported for the 'devcontainers' package ecosystem.",
                    params: {},
                    schemaPath: '#/customError',
                },
            ],
        });
    });
});
