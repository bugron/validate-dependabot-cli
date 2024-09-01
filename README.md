This CLI tests the dependabot.yml against the [official v2 JSON schema](https://json.schemastore.org/dependabot-2.0.json). It does not detect all invalid dependabot files as dependabot has extra validation beyond the JSON schema.

## Why?

If you get a validation error when editing your config, you won't know if there's a problem until the next dependabot runs.
Even if the cycle is long and the alarm is not set, it may be detected much later.
This CLI allows you to find some problems even before commiting dependabot.yml.

## Usage

```
$ @bugron/validate-dependabot-yaml <path>

<path>
  Path to the dependabot configuration file relative to current working directory, .github/dependabot.yml by default

Options
  --logger, -l  Logger type (json, markdown)
  --pretty, -p  Only for json logger, prettify JSON output

Output
  Success: process exits with status 0, no output is logged
  Failure: process exits with status 1, JSON or Markdown formatted validation error messages are logged

Examples
$ @bugron/validate-dependabot-yaml .github/dependabot.yml --logger=json --pretty
```

## Any problem?

Feel free to report issues. 😃
