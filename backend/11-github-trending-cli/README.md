# GitHub Trending CLI

A lightweight TypeScript command-line tool to fetch and display trending GitHub repositories based on creation date and star count.

## Features

- Filter by duration (today, week, month)
- Customizable result limit (up to 30)
- Displays stars, primary language, description, and repository URL
- Handles GitHub API rate limiting with descriptive error messages

## Installation

```bash
npm install
```

## Usage

Run the tool using `npm start` followed by optional arguments:

```bash
npm start -- --duration [today|week|month|year] --limit [number]
```

### Options

| Option       | Description                    | Default | Constraints              |
| :----------- | :----------------------------- | :------ | :----------------------- |
| `--duration` | Time window for "trending"     | `week`  | `today`, `week`, `month` |
| `--limit`    | Number of repositories to show | `10`    | Min: 1, Max: 30          |

### Examples

**Fetch top 5 repositories from today:**

```bash
npm start -- --duration today --limit 5
```

**Fetch top 20 repositories from the last month:**

```bash
npm start -- --duration month --limit 20
```
