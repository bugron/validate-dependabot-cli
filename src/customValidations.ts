import type { ErrorObject } from 'ajv';
import type { parseDependabotYaml } from './parseDependabotYaml.js';
import { uniqueCombination } from './validators/uniqueCombination.js';
import { dependencyTypeGroups } from './validators/dependencyTypeGroups.js';

export function customValidations(
    json: ReturnType<typeof parseDependabotYaml>,
): ErrorObject[] {
    return [uniqueCombination, dependencyTypeGroups].reduce(
        (errors, validatorFunction) => {
            const error = validatorFunction(json);

            if (error) {
                return [...errors, error];
            }

            return errors;
        },
        [] as ErrorObject[],
    );
}
