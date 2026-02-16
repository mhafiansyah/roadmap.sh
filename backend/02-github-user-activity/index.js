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

// use local cache on development environment
async function fetchLocalCache() {
    const localCache = JSON.parse(await fs.readFile(CACHE_FILE, 'utf-8'));
    return localCache.data;
}

// Top-level await is available in ES Modules
// use local fetch on development environment, change to remote fetch on live environment
const events = await fetchGithubActivity();
// const events = await fetchLocalCache();

const groupByEvent = events.reduce((accumulator, event) => {
    const action = getActionName(event);
    const repo = event.repo.name;

    // check action already exist, if not create an object with action as key
    if (!accumulator[action]) accumulator[action] = {};
    accumulator[action][repo] = (accumulator[action][repo] || 0) + 1;

    return accumulator;
}, {});

// Convert the object groupByEvent into an array of [actionName, repoObject]
const sortedByAction = Object.entries(groupByEvent)
    .map(([action, repos]) => {
        // calculate the total event for this action
        const totalEvents = Object.values(repos).reduce((sum, count) => {
            return sum + count
        }, 0);
        return { action, repos, totalEvents };
    })
    .sort((a, b) => b.totalEvents - a.totalEvents);

console.log(`Event Based Summary for ${username}`);
console.log(`${'-'.repeat(50)}`);

if (sortedByAction.length === 0) {
    console.log('No recent activity found for this user');
} else {
    sortedByAction.forEach(({ action, repos, totalEvents }) => {
        const repoCount = Object.keys(repos).length;
        const repoLabel = repoCount > 1 ? 'repositories' : 'repository';
        console.log(`\n${totalEvents} ${action} in ${repoCount} ${repoLabel}`);

        const sortedRepos = Object.entries(repos)
            // Object.entries(repos) will return something like this
            // [ 'SnosMe/poe-dat-viewer', 1 ] [ 'SnosMe/awakened-poe-trade', 4 ] 
            // you can sort with / without destructuring the array

            // sort without destructuring the array
            // need to give the array second element, because the first element is the repo name
            // .sort((a, b) => b[1] - a[1]);

            // Destructured way (cleaner)
            // The "empty" space before the comma skips the repository name string.
            .sort(([, a], [, b]) => b - a);

        for (const [repo, count] of sortedRepos) {
            const label = count > 1 ? 'occurences' : 'occurence';
            console.log(`|- ${repo.padEnd(35)} [${count} ${label}]`);
        }
    });
}
console.log(`${'-'.repeat(50)}`);