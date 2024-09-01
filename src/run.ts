#!/usr/bin/env node
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { validateDependabotYaml } from './validateDependabotYaml.js';
import { jsonLogger, markdownLogger } from './errorLoggers.js';
import cli from './cli.js';

async function run(cliResult: typeof cli): Promise<void> {
    const dependabotYamlRelativePath =
        cliResult.input[0] ?? '.github/dependabot.yml';

    // load target file
    const yaml = readFileSync(
        path.join(process.cwd(), dependabotYamlRelativePath),
        'utf-8',
    );

    const { errors } = await validateDependabotYaml(yaml);

    if (!errors) {
        return;
    }

    cliResult.flags.format === 'json' &&
        jsonLogger(errors, cliResult.flags.pretty);
    cliResult.flags.format === 'markdown' && markdownLogger(errors);

    process.exit(1);
}

run(cli);
