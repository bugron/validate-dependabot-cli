import schema from './schema/dependabot-2.0.json' with { type: 'json' };

export async function fetchSchema(): Promise<object> {
    return schema;
}
