import Ajv, { type ErrorObject } from 'ajv';
import { parseDependabotYaml } from './parseDependabotYaml.js';
import { customValidations } from './customValidations.js';
import { fetchSchema } from './fetchSchema.js';

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
        schema = await fetchSchema();
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
