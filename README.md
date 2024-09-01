This CLI tests the dependabot.yml against the [official v2 JSON schema](https://json.schemastore.org/dependabot-2.0.json). It does not detect all invalid dependabot files as dependabot has extra validation beyond the JSON schema.

## Why?

If you get a validation error when editing your config, you won't know if there's a problem until the next dependabot runs.
Even if the cycle is long and the alarm is not set, it may be detected much later.
This CLI allows you to find some problems even before committing dependabot.yml.

## Usage

```
$ npx @bugron/validate-dependabot-yaml@latest --help

  CLI for validating Dependabot v2 YAML configuration files

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
```

## Test coverage

The validation logic is tested on almost all cases/examples from the [official documentation](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file) and more.

## Any problem?

Feel free to report issues. 😃
