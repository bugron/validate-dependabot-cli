import { test, describe, expect } from 'vitest';

import { validateDependabotYaml } from '../src/validateDependabotYaml.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const successConfig = readFileSync(
    path.join(process.cwd(), '.github/dependabot.yml'),
    'utf-8',
);

const errorConfig = readFileSync(
    path.join(process.cwd(), '__tests__/dependabot-error.yml'),
    'utf-8',
);

describe('validateDependabot', () => {
    test('no errors', async () => {
        expect(await validateDependabotYaml(successConfig)).toEqual({
            message: 'success',
        });
    });

    test('with errors', async () => {
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
            ],
        });
    });
});
