# Todo List API

A RESTful Todo List API built with Node.js, Express, and Drizzle ORM. This project is a solution for the [Todo List API](https://roadmap.sh/projects/todo-list-api) challenge from [roadmap.sh](https://roadmap.sh).

## Tech Stack

- **Backend :** Node.js, Express.js
- **Database :** PostgreSQL with Drizzle ORM
- **Validation :** Zod
- **Auth :** JWT

## Features

- User Registration & Login
- CRUD operations for Todos
- Pagination & Sorting (`sortBy`, `order`)
- Request validation via middleware
- Protected routes using JWT

## Setup

1. Install dependencies: `npm install`
2. Configure `.env` with `DATABASE_URL` and `JWT_SECRET`
3. Push database schema: `npx drizzle-kit push`
4. Start development server: `npm run dev`

## API Endpoints

### Auth

- `POST /auth/register` - Create a new account
- `POST /auth/login` - Get access token

### Todos (Protected)

- `GET /todos` - List todos (supports `page`, `limit`, `sortBy`, `order`)
- `POST /todos` - Create todo
- `GET /todos/:id` - Get specific todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo
