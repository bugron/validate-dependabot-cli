import YAML from 'yaml';

type Update = {
    'package-ecosystem': string;
    schedule: {
        interval: string;
        time?: string;
        timezone?: string;
    };
    'target-branch'?: string;
    vendor?: boolean;
    registries?: string[];
    'open-pull-requests-limit'?: number;
    'rebase-strategy'?: 'auto' | 'disabled';
    labels?: string[];
    assignees?: string[];
    reviewers?: string[];
    'insecure-external-code-execution'?: 'allow';
    'pull-request-branch-name'?: {
        separator: '-' | '_' | '/';
    };
    groups?: Record<
        string,
        {
            // any of
            'applies-to'?: 'version-updates' | 'security-updates';
            'dependency-type'?: 'development' | 'production';
            patterns?: string[];
            'exclude-patterns'?: string[];
            'update-types'?: 'major' | 'minor' | 'patch';
        }
    >;
    'commit-message'?: {
        // any of
        prefix?: string;
        'prefix-development'?: string;
        include?: 'scope' | 'dependencies';
    };
    'commit-prefix'?: string;
    allow?: {
        // any of
        'dependency-name'?: string;
        'dependency-type'?: undefined;
    }[];
    ignore?: {
        // any of
        'dependency-name'?: string;
        versions?: string[];
        'update-types'?: [
            | 'version-update:semver-major'
            | 'version-update:semver-minor'
            | 'version-update:semver-patch',
        ];
    }[];
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
