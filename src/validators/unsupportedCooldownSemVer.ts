import type { ErrorObject } from 'ajv';
import type { parseDependabotYaml } from '../parseDependabotYaml.js';

const SUPPORTED_ECOSYSTEMS = [
    'bundler',
    'bun',
    'cargo',
    'composer',
    'dotnet-sdk',
    'elm',
    'gomod',
    'gradle',
    'mix',
    'maven',
    'npm',
    'nuget',
    'pip',
    'pub',
    'swift',
    'uv',
];

/**
 * Fixes the issue mentioned in https://github.com/dependabot/dependabot-core/issues/13121#issuecomment-3314288971
 * See docs: https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#configuration-of-cooldown
 *
 * Ensures cooldown semver-major-days, semver-minor-days, semver-patch-days options are used with supported package ecosystems
 */
export function unsupportedCooldownSemVer(
    json: ReturnType<typeof parseDependabotYaml>,
): ErrorObject[] | undefined {
    const errorObjects: ErrorObject[] = [];

    for (let index = 0; index < json.updates.length; index++) {
        const update = json.updates[index];

        if (
            update?.cooldown &&
            !SUPPORTED_ECOSYSTEMS.includes(update['package-ecosystem'])
        ) {
            const semverKeys: (keyof typeof update.cooldown)[] = [
                'semver-major-days',
                'semver-minor-days',
                'semver-patch-days',
            ];

            for (const key of semverKeys) {
                if (update.cooldown[key] !== undefined) {
                    errorObjects.push({
                        keyword: 'unsupportedCooldownSemVer',
                        dataPath: `/updates/${index}/cooldown/${key}`,
                        schemaPath: '#/customError',
                        params: {},
                        message: `The '${key}' option in 'cooldown' is not supported for the '${update['package-ecosystem']}' package ecosystem.`,
                    });
                }
            }
        }
    }

    return errorObjects;
}
