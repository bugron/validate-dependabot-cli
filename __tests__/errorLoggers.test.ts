import { test, describe, expect, vi, beforeEach } from 'vitest';
import { jsonLogger, markdownLogger } from '../src/errorLoggers.js';

const errorArray = [
    {
        keyword: 'maxLength',
        dataPath: ".updates[0]['commit-message'].prefix",
        schemaPath: '#/properties/commit-message/properties/prefix/maxLength',
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
        dataPath: ".updates[1]['commit-message']['prefix-development']",
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
];

describe('error loggers', () => {
    const loggerStub = vi.spyOn(process.stdout, 'write');

    beforeEach(() => {
        loggerStub.mockClear();
    });

    describe('jsonLogger', () => {
        test('stringifies the error JSON array and prints to the console', () => {
            jsonLogger(errorArray);

            expect(loggerStub).toBeCalledWith(JSON.stringify(errorArray));
        });

        test('prettifies validation errors', () => {
            jsonLogger(errorArray, true);

            expect(loggerStub).toBeCalledWith(
                JSON.stringify(errorArray, null, 2),
            );
        });
    });

    describe('markdownLogger', () => {
        test('prints a markdown table with validation errors to the console', () => {
            markdownLogger(errorArray);

            expect(loggerStub).toBeCalledWith(`
## Dependabot YAML validation errors

| keyword | message | dataPath |
| ------- | ------- | -------- |
| maxLength | should NOT be longer than 50 characters | .updates[0]['commit-message'].prefix |
| required | should have required property 'schedule' | .updates[0] |
| required | should have required property 'directories' | .updates[0] |
| required | should have required property 'directory' | .updates[0] |
| oneOf | should match exactly one schema in oneOf | .updates[0] |
| maxLength | should NOT be longer than 50 characters | .updates[1]['commit-message']['prefix-development'] |
| required | should have required property 'schedule' | .updates[1] |
| required | should have required property 'directories' | .updates[1] |
| required | should have required property 'directory' | .updates[1] |
| oneOf | should match exactly one schema in oneOf | .updates[1] |
`);
        });
    });
});
