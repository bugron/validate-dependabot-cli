import YAML from 'yaml';

type Update = {
    'package-ecosystem': string;
    schedule: {
        interval: string;
        time?: string;
        timezone?: string;
    };
    'target-branch'?: string;
    registries?: string[];
    ignore?: string[];
    labels?: string[];
    assignees?: string[];
    reviewers?: string[];
    'commit-message'?: string;
    'commit-prefix'?: string;
    allow?: {
        'dependency-name': {
            'dependency-type': string;
            versions: string[];
        };
    };
    'update-types'?: [
        | 'version-update:semver-major'
        | 'version-update:semver-minor'
        | 'version-update:semver-patch',
    ];
    'versioning-strategy'?:
        | 'auto'
        | 'widen'
        | 'increase'
        | 'increase-if-necessary'
        | 'lockfile-only';
    'pr-title'?: string;
    'pr-body'?: string;
    automerge?: boolean;
};
type UpdateWithDirectory = Update & { directory: string };
type UpdateWithDirectories = Update & { directories: string[] };

type DependabotYaml = {
    version: 2;
    'enable-beta-ecosystems'?: boolean;
    updates: (UpdateWithDirectory | UpdateWithDirectories)[];
    registries?: Record<
        string,
        {
            type: string;
            url?: string;
            'replaces-base'?: boolean;
        } & (
            | {
                  username: string;
                  password: string;
              }
            | {
                  token: string;
              }
        )
    >;
};

export function parseDependabotYaml(
    dependabotYamlContents: string,
): DependabotYaml {
    return YAML.parse(dependabotYamlContents);
}
