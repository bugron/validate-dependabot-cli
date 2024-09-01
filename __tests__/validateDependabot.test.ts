import { test, describe, expect } from 'vitest';

import path from 'node:path';
import { readFileSync } from 'node:fs';
import { validateDependabotYaml } from '../src/validateDependabotYaml.js';
import v2Schema from './dependabot-2.0.json';

const getConfig = (configPath: string): string =>
    readFileSync(path.join(process.cwd(), configPath), 'utf-8');

const errorConfig = getConfig('__tests__/configs/dependabot-error.yml');

describe('validateDependabot', () => {
    test.each([
        ['.github/dependabot.yml'],
        ['__tests__/configs/dependabot-with-group.yml'],
        ['__tests__/configs/dependabot-with-multiple-groups.yml'],
    ])(`with no errors: %s`, async configPath => {
        const config = getConfig(configPath);

        expect(await validateDependabotYaml(config, v2Schema)).toEqual({
            message: 'success',
        });
    });

    test('with errors', async () => {
        expect(await validateDependabotYaml(errorConfig, v2Schema)).toEqual({
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
        ['__tests__/configs/dependabot-unique-combination-error.yml'],
        ['__tests__/configs/dependabot-unique-combination-error2.yml'],
    ])(`with unique combination error: %s`, async configPath => {
        const config = getConfig(configPath);

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
});
