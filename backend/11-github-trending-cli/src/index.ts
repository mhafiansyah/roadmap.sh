import { fetchGithubTrending } from '@/services/github.services.js';
import { parseArguments } from '@/utils/parseArgs.js';

const args = process.argv.slice(2);
const options = parseArguments(args);
const repositories = await fetchGithubTrending(options.duration, options.limit);

if (repositories.length === 0) {
  console.log('No trending repositories found for the selected period.');
} else {
  console.log(`\n--- Trending Repositories (Last ${options.duration}, Limit: ${options.limit}) ---\n`);
  
  repositories.forEach((repo, index) => {
    console.log(`${index + 1}. ${repo.name}`);
    console.log(`   Stars:       ${repo.stars.toLocaleString()}`);
    console.log(`   Language:    ${repo.language || 'N/A'}`);
    console.log(`   Description: ${repo.description || 'No description provided.'}`);
    console.log(`   URL:         ${repo.url}`);
    console.log('');
  });
}
