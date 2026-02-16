import fs from 'node:fs/promises';
import { URL } from 'node:url';

const username = process.argv[2];
if (!username) {
    console.error('Usage: node index.js <username>');
    process.exit(1);
}

async function main() {
    const URL = `https://api.github.com/users/${username}/events`;
    const options = { headers: { 'User-Agent': 'node-js-cli' } };
    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            if (response.ok === 404 ) throw new Error('User not found');
            throw new Error(`Github API error: ${response.status}`);
        }
        const results = await response.json();

        results.forEach(event => {
            console.log(`- ${event.type} in ${event.repo.name}`);
        });
    } catch (err) {
        console.error("🚀 ~ main ~ err:", err)
    }
}

main();