import fs from 'node:fs/promises';
import { URL } from 'node:url';

const username = process.argv[2];
if (!username) {
    console.error('Usage: node index.js <username>');
    process.exit(1);
}

const CACHE_FILE = new URL (`./.cache_${username}.json`, import.meta.url);

async function fetchGithubActivity() {
    const URL = `https://api.github.com/users/${username}/events`;
    let cache = null;

    try {
        cache = JSON.parse(await fs.readFile(CACHE_FILE, 'utf-8'));
    } 
    // catch will get an error on first run (no cache file yet), ignore it then continue the code to make cache file
    catch {}

	const headers = { 
		'User-Agent': 'node-js-cli',
		'Accept': 'application/vnd.github+json'
	};
    // conditional chaining, if etag is exist in cache, add if-none-match headers with value of etag 
    if (cache?.etag) headers['If-None-Match'] = cache.etag;

    try {
        const response = await fetch(URL, { headers });
        const rateLimit = response.headers.get('x-ratelimit-remaining');
        console.log(`x-rate-limit: ${rateLimit}`);
        
        // response status 304 means there is no new update (cache file is still up to date)
        if (response.status === 304 && cache) return cache.data

        if (!response.ok) {
            if (response.ok === 404 ) throw new Error('User not found');
            throw new Error(`Github API error: ${response.status}`);
        }

        // if there is a new update, then write the new data into cache file
        const data = await response.json();
        // etag value exist in response headers, not in response body
        const etag = response.headers.get('etag');        

        // update cache file
        await fs.writeFile(CACHE_FILE, JSON.stringify({ etag, data }, null, 2));
        console.log(`Fetched fresh data from github.`)
        return data;        
    } catch (err) {
        console.error("🚀 ~ fetchGithubActivity ~ err:", err)
        return cache?.data || [];
    }
}

// function to simplifies github event names
function getActionName(event) {
    switch(event.type){
        case 'PushEvent': return 'Commits Pushed';
        case 'WatchEvent': return 'Repositories Starred';
        case 'IssuesEvent': return 'Issues Managed';
        case 'CreateEvent': return 'Resource Created';
        case 'IssueCommentEvent': return 'Comments Posted';
        case 'PullRequestEvent': return 'Pull Requests';
        default: return `${event.type.replace('Event', '')} actions`;
    }
}

// Top-level await is available in ES Modules
const events = await fetchGithubActivity();

if (events.length === 0) {
    console.log(`There is no recent activity for this user`);
} else {
    events.forEach((event) => {
        const action = getActionName(event);
        const repo = event.repo.name;

        console.log(`- ${action} in ${repo}`);
    })
}