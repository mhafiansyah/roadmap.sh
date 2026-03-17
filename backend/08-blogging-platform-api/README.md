# Blogging Platform API

A RESTful API for managing blog posts, built with **Express 5**, **Drizzle ORM** (PostgreSQL), and **Redis** for caching. This project is a solution for the [Blogging Platform API](https://roadmap.sh/projects/blogging-platform-api) challenge from [roadmap.sh](https://roadmap.sh).

## Features

- Integrated Redis caching for single post retrieval.
- Optimized search across titles, content, and categories using PostgreSQL `tsvector` and GIN indexes.
- Built-in pagination for both listing and searching posts.
- Protection against brute-force and DDoS attacks (100 requests per 15 minutes).
- Request validation using Zod schemas.
- Built with TypeScript and Express 5 (Alpha/Beta features).

## Tech Stack

- **Backend**: Express 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis
- **Validation**: Zod

## Prerequisites

- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **Redis**: 6.x or higher

## Installation

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@localhost:5432/db_name
   REDIS_URL=redis://localhost:6379
   ```

## Database Setup

1. Push the schema to your PostgreSQL database:

   ```bash
   npx drizzle-kit push
   ```

2. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

## Running the API

Start the development server with hot-reloading:

```bash
npm run dev
```

## API Endpoints

### Posts (`/posts`)

| Method   | Endpoint                      | Description                                        |
| :------- | :---------------------------- | :------------------------------------------------- |
| `GET`    | `/posts?page=1`               | List all posts (paginated).                        |
| `GET`    | `/posts?terms=keyword&page=1` | Search posts by title, content, or category.       |
| `GET`    | `/posts/:id`                  | Get a single post (cached in Redis for 5 mins).    |
| `POST`   | `/posts`                      | Create a new post.                                 |
| `PUT`    | `/posts/:id`                  | Update an existing post (invalidates Redis cache). |
| `DELETE` | `/posts/:id`                  | Delete a post (invalidates Redis cache).           |

#### Sample Create Request Body

```json
{
  "title": "Getting Started with Drizzle ORM",
  "content": "Drizzle ORM is a lightweight TypeScript ORM...",
  "category": "Development",
  "tags": ["orm", "typescript", "postgres"]
}
```
