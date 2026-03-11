# Weather API

a solution for [Weather API](https://roadmap.sh/projects/weather-api-wrapper-service) challenge from [roadmap.sh](https://roadmap.sh) website

## Tech Stack

Express, Redis, Axios

## Features

- Caching API results using redis
- Multiple city requests
- Filter data by date

## Getting Started

### Prerequisites

- Node.js
- Redis

### Environment Variables

Change .env.example to .env and edit the content of the file

```
VISUAL_CROSSING_API =
PORT =
REDIS_URL =
CACHE_TTL =
```

### Install Dependencies

```
npm install
```

### Running the application

```
npm run dev
```

## How to

how to fetch multiple city

```
http://localhost:[PORT]/weather?city=London,Jakarta
or
http://localhost:[PORT]/weather?cityLondon&city=Jakarta
```

how to fetch a specific date (YYYY-MM-DD)

```
http://localhost:[PORT]/weather?city=Jakarta&date=2026-03-10
```
