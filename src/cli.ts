import meow from 'meow';

export default meow(
    `
      Usage
        $ npx @bugron/validate-dependabot-yaml [path]

      [path]
        Optional path to dependabot configuration file relative to current working directory (default: .github/dependabot.yml)

      Options
        --format, -f    Logger type, either json or markdown (default: markdown)
        --pretty, -p    Only used for json logger, prettifies JSON output

      Output
        Success: process exits with status 0, no output is logged
        Failure: process exits with status 1, JSON or Markdown formatted validation error messages are logged

      Examples
        $ npx @bugron/validate-dependabot-yaml
        $ npx @bugron/validate-dependabot-yaml config/dependabot.yaml
        $ npx @bugron/validate-dependabot-yaml .github/dependabot.yml --f=json --p
        $ npx @bugron/validate-dependabot-yaml .github/dependabot.yml --format=json --pretty
        $ npx @bugron/validate-dependabot-yaml .github/dependabot.yml --f=markdown
        $ npx @bugron/validate-dependabot-yaml .github/dependabot.yml --format=markdown
  `,
    {
        importMeta: import.meta,
        flags: {
            format: {
                type: 'string',
                choices: ['json', 'markdown'],
                default: 'markdown',
                shortFlag: 'f',
            },
            pretty: {
                type: 'boolean',
                shortFlag: 'p',
            },
        },
    },
);
