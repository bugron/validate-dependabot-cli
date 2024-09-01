import type { ErrorObject } from 'ajv';

export function jsonLogger(errors: ErrorObject[], pretty = false): void {
    process.stdout.write(JSON.stringify(errors, null, pretty ? 2 : 0));
}

export function markdownLogger(errors: ErrorObject[]): void {
    const lines = errors
        .map(
            ({ keyword, message, dataPath }) =>
                `| ${keyword} | ${message} | ${dataPath} |`,
        )
        .join('\n');

    const message = `
## Dependabot YAML validation errors

| keyword | message | dataPath |
| ------- | ------- | -------- |
${lines}
`;

    process.stdout.write(message);
}
