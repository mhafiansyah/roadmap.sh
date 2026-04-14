# Caching Proxy Server

A CLI tool that starts a proxy server and caches responses using Redis.

[Caching Proxy](https://roadmap.sh/projects/caching-server) challenge from [roadmap.sh](https://roadmap.sh).

## Prerequisites

- Node.js
- Redis server

## Installation

```bash
npm install
```

## Usage

### Start the Proxy Server

Forward requests from a local port to an origin URL.

```bash
# General usage
npx tsx ./src/cli.ts start --port <number> --origin <url>

# Example
npx tsx ./src/cli.ts start --port 3000 --origin http://dummyjson.com
```

### Clear Cache

Remove all cached responses from Redis.

```bash
npx tsx ./src/cli.ts clear-cache
```

## Configuration

Environment variables can be set in a `.env` file:

| Variable    | Description                 | Default                  |
| ----------- | --------------------------- | ------------------------ |
| `REDIS_URL` | Redis connection string     | `redis://localhost:6379` |
| `CACHE_TTL` | Cache expiration in seconds | `60`                     |

## Scripts

- `npm run dev`: Starts the server on port 3000 proxying to `http://dummyjson.com`.
- `npm run clear`: Clears the Redis cache.
