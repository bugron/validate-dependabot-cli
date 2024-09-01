import fetch from 'node-fetch';

export async function fetchSchema(): Promise<object> {
    const response = await fetch(
        'https://json.schemastore.org/dependabot-2.0.json',
    );

    return response.json() as object;
}
