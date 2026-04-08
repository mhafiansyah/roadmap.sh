import { fetchGithubTrending } from '@/services/github.services.js';
import { parseArguments } from '@/utils/parseArgs.js';

const args = process.argv.slice(2);
const options = parseArguments(args);
const repo = await fetchGithubTrending(options.duration, options.limit);
console.log(repo);
