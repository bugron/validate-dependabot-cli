import meow from 'meow';

export default meow(
    `
      Usage
        $ npx @bugron/validate-dependabot-yaml <path>
  
      Path
        Path to the dependabot configuration file relative to current working directory, .github/dependabot.yml by default
      
      Options
        --format, -f  Logger type (json, markdown)
        --pretty, -p  Only for json logger, prettify JSON output

      Output
        Success: process exits with status 0, no output is logged
        Failure: process exits with status 1, JSON or Markdown formatted validation error messages are logged
  
      Examples
        $ npx @bugron/validate-dependabot-yaml .github/dependabot.yml --format=json --pretty
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
