import type { ErrorObject } from 'ajv';
import type { parseDependabotYaml } from './parseDependabotYaml.js';
import { uniqueCombination } from './validators/uniqueCombination.js';
import { dependencyTypeGroups } from './validators/dependencyTypeGroups.js';
import { unsupportedCooldownSemVer } from './validators/unsupportedCooldownSemVer.js';

export function customValidations(
    json: ReturnType<typeof parseDependabotYaml>,
): ErrorObject[] {
    return [
        uniqueCombination,
        dependencyTypeGroups,
        unsupportedCooldownSemVer,
    ].reduce((errors, validatorFunction) => {
        const error = validatorFunction(json);

        if (!error) {
            return errors;
        }

        if (Array.isArray(error)) {
            return [...errors, ...error];
        }

        return [...errors, error];
    }, [] as ErrorObject[]);
}
