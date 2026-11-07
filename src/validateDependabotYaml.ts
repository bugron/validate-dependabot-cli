import Ajv, { type ErrorObject } from 'ajv';
import {
    parseDependabotYaml,
    UnsupportedYamlAliasError,
} from './parseDependabotYaml.js';
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

    let json: ReturnType<typeof parseDependabotYaml>;
    try {
        json = parseDependabotYaml(dependabotYamlContents);
    } catch (error) {
        if (!(error instanceof UnsupportedYamlAliasError)) {
            throw error;
        }

        return {
            message: 'failure',
            errors: [
                {
                    keyword: 'yamlAliases',
                    dataPath: '',
                    schemaPath: '#/yamlAliases',
                    params: {},
                    message: error.message,
                },
            ],
        };
    }
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
