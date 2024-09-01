import Ajv, { type ErrorObject } from 'ajv';
import fetch from 'node-fetch';
import { parseDependabotYaml } from './parseDependabotYaml.js';
import { customValidations } from './customValidations.js';

export async function validateDependabotYaml(
    dependabotYamlContents: string,
): Promise<{
    errors?: ErrorObject[];
    message: string;
}> {
    const ajv = new Ajv({ extendRefs: true, allErrors: true });

    const json = parseDependabotYaml(dependabotYamlContents);
    const customErrors = customValidations(json);

    // load schema
    const response = await fetch(
        'https://json.schemastore.org/dependabot-2.0.json',
    );

    const schema = (await response.json()) as object;

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
