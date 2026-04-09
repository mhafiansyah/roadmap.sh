import type { TDurationOptions } from '@/types/cli.types.js';
import { getDateConvert } from '@/utils/dateConverter.js';

type TGithubRepository = {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
};

type TGithubSearchResponse = {
  items: Array<{
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    language: string | null;
  }>;
};

export const fetchGithubTrending = async (
  duration: TDurationOptions,
  limit: number,
): Promise<TGithubRepository[]> => {
  const searchParams = new URLSearchParams({
    q: `created:>${getDateConvert(duration)}`,
    sort: 'stars',
    order: 'desc',
    per_page: String(Math.min(limit, 100)),
  });
  const URL = `https://api.github.com/search/repositories?${searchParams.toString()}`;
  const headers = {
    'User-Agent': 'github-trends-cli',
    Accept: 'application/vnd.github+json',
  };

  const response = await fetch(URL, { headers });
  const rateRemaining = response.headers.get('x-ratelimit-remaining');
  const rateReset = response.headers.get('x-ratelimit-reset');

  if (!response.ok) {
    if (response.status === 403 && rateRemaining === '0') {
      const resetDate = new Date(Number(rateReset) * 1000).toLocaleDateString();
      throw new Error(`Github rate limit exceeded. Try again at ${resetDate}`);
    }
    throw new Error(
      `Github API requests failed with status ${response.status}`,
    );
  }
  console.log(`Requests remaining: ${rateRemaining}`);
  const data = (await response.json()) as TGithubSearchResponse;

  return data.items.map((repo) => {
    return {
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
    };
  });
};
