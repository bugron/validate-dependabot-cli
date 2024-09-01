import type { ErrorObject } from 'ajv';
import type { parseDependabotYaml } from '../parseDependabotYaml.js';

/**
 * Fixes the issue mentioned in https://github.com/marocchino/validate-dependabot/issues/743
 * See docs: https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#directory
 *
 * Directory/directories values must be unique and cannot overlap with the directory or directories entries in blocks that have the same ecosystem and target-branch.
 */
export function uniqueCombination(
    json: ReturnType<typeof parseDependabotYaml>,
): ErrorObject | undefined {
    // 1. Group updates by package-ecosystem and target-branch
    const groupedUpdates = json.updates.reduce(
        (allUpdates, update) => {
            const key = `${update['package-ecosystem']}-${update['target-branch']}`;

            allUpdates[key] = [...(allUpdates[key] || []), update];

            return allUpdates;
        },
        {} as Record<string, ReturnType<typeof parseDependabotYaml>['updates']>,
    );

    const hasUniqueConstraintError = Object.keys(groupedUpdates).some(key => {
        const groupUpdates = groupedUpdates[key];

        // 2. Collect all directories
        const allDirectories = groupUpdates?.flatMap(update => {
            if ('directory' in update) {
                return [update.directory];
            }

            return update.directories;
        });

        // 3. Check if there are any duplicate directories
        return new Set(allDirectories).size !== allDirectories?.length;
    });

    if (hasUniqueConstraintError) {
        return {
            keyword: 'customError',
            dataPath: '.updates',
            schemaPath: '#/customError',
            params: {
                propertyName: 'customError',
            },
            message:
                "Update configs must have a unique combination of 'package-ecosystem', 'directory', and 'target-branch'",
        };
    }
}
