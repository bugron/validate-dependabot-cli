import Ajv, { type ErrorObject } from 'ajv';
import YAML from 'yaml';
import fetch from 'node-fetch';

export async function validateDependabotYaml(
    dependabotYamlContents: string,
): Promise<{
    errors?: ErrorObject[] | null | undefined;
    message: string;
}> {
    const ajv = new Ajv({ extendRefs: true, allErrors: true });

    const json = YAML.parse(dependabotYamlContents);

    // load schema
    const response = await fetch(
        'https://json.schemastore.org/dependabot-2.0.json',
    );

    const schema = (await response.json()) as object;

    // validate
    const validate = ajv.compile(schema);
    const valid = await validate(json);

    if (valid) {
        return { message: 'success' };
    }

    return { errors: validate.errors, message: 'failure' };
}
