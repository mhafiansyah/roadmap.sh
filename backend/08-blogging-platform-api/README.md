# Blogging Platform API

A RESTful API for managing blog posts, built with **Express 5**, **TypeScript**, and **Drizzle ORM** (PostgreSQL).

## Prerequisites
- Node.js 18+
- PostgreSQL database

## Installation
```bash
npm install
```

## Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/db_name
```

## Database Setup
Generate and apply migrations using Drizzle:
```bash
npx drizzle-kit push
```

## Running the API
```bash
npm run dev
```

## API Endpoints

### Posts (`/posts`)
- `GET /posts` - List all posts.
- `GET /posts?terms=keyword` - Search posts by title, content, or category.
- `GET /posts/:id` - Get a single post by ID.
- `POST /posts` - Create a new post.
    - Body: `{"title": "...", "content": "...", "category": "...", "tags": ["..."]}`
- `PUT /posts/:id` - Update an existing post.
- `DELETE /posts/:id` - Delete a post.
