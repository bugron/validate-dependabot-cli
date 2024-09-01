import type { ErrorObject } from 'ajv';
import type { parseDependabotYaml } from '../parseDependabotYaml.js';

export function uniqueCombination(
    json: ReturnType<typeof parseDependabotYaml>,
): ErrorObject | undefined {
    const groupedUpdates = json.updates.reduce(
        (allUpdates, update) => {
            const key = `${update['package-ecosystem']}-${update['target-branch']}`;

            allUpdates[key] = [...(allUpdates[key] || []), update];

            return allUpdates;
        },
        {} as Record<string, ReturnType<typeof parseDependabotYaml>['updates']>,
    );

    const hasUniqueConstraintError = Object.keys(groupedUpdates).some(key => {
        const groupUpdate = groupedUpdates[key];

        const allDirectories = groupUpdate?.flatMap(update => {
            if ('directory' in update) {
                return [update.directory];
            }

            return update.directories;
        });

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
