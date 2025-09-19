import type { ErrorObject } from 'ajv';
import type { parseDependabotYaml } from '../parseDependabotYaml.js';

const SUPPORTED_ECOSYSTEMS = [
    'bundler',
    'composer',
    'mix',
    'maven',
    'npm',
    'pip',
];

/**
 * Fixes the issue mentioned in https://github.com/dependabot/dependabot-core/issues/13121
 * See docs: https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#dependency-type-groups
 *
 * Ensures that dependency-type option is used with supported package ecosystems
 */
export function dependencyTypeGroups(
    json: ReturnType<typeof parseDependabotYaml>,
): ErrorObject | undefined {
    const hasError = json.updates.some(
        update =>
            !SUPPORTED_ECOSYSTEMS.includes(update['package-ecosystem']) &&
            Object.keys(update.groups ?? []).some(
                groupName =>
                    update.groups?.[groupName]?.['dependency-type'] !==
                    undefined,
            ),
    );

    if (hasError) {
        return {
            keyword: 'customError',
            dataPath: '.dependency-type',
            schemaPath: '#/customError',
            params: {
                propertyName: 'customError',
            },
            message: `'dependency-type' option is only supported for the following package ecosystems: ${SUPPORTED_ECOSYSTEMS}`,
        };
    }
}
