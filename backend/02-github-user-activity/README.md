# GitHub User Recent Activity
sample solution for the [Github User Activity CLI](https://roadmap.sh/projects/github-user-activity) challenge from [roadmap.sh](https://roadmap.sh).

this is a simple cli application for fetching github user recent activity.

## Features
- structured output grouped by event and sorted by frequency
- implement caching using github ETag system to minimize API call and respect rate limit 

## How Caching Works
The CLI saves `.cache_<username>.json` file. on requests it sends `If-None-Match` header with `etag` value.

if the data hasn't changed, github return a `304 Not Modified` status, and CLI will load data from local cache.


## How to run
**Clone the repository**
```
git clone https://github.com/mhafiansyah/roadmap.sh.git

#Navigate to the project directory
cd backend/02-github-user-activity
```

## Usage
```
node index.js <username>
```

## Sample  Output
```
Event Based Summary for mhafiansyah
--------------------------------------------------

9 Commits Pushed in 1 repository
|- mhafiansyah/roadmap.sh              [9 occurences]

2 Resource Created in 1 repository
|- mhafiansyah/roadmap.sh              [2 occurences]
--------------------------------------------------
```