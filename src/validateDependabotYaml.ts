import Ajv, { type ErrorObject } from 'ajv';
import fetch from 'node-fetch';
import { parseDependabotYaml } from './parseDependabotYaml.js';
import { customValidations } from './customValidations.js';

export async function validateDependabotYaml(
    dependabotYamlContents: string,
    v2Schema?: object,
): Promise<{
    errors?: ErrorObject[];
    message: string;
}> {
    const ajv = new Ajv({ extendRefs: true, allErrors: true });

    const json = parseDependabotYaml(dependabotYamlContents);
    const customErrors = customValidations(json);

    let schema = v2Schema;
    if (!schema) {
        // load schema
        const response = await fetch(
            'https://json.schemastore.org/dependabot-2.0.json',
        );

        schema = (await response.json()) as object;
    }

    // validate
    const validate = ajv.compile(schema);
    const valid = (await validate(json)) && !customErrors.length;

    if (valid) {
        return { message: 'success' };
    }

    return {
        errors: [...(validate.errors ?? []), ...customErrors],
        message: 'failure',
    };
}
