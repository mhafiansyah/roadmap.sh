# Personal Blog

A full-stack personal blog application with a React frontend, Express backend, and Prisma/PostgreSQL database.

## Tech Stack

- **Frontend:** React 19, React Router 7
- **Backend:** Express 5, Prisma ORM, PostgreSQL
- **Auth:** Better-Auth

## Features

- Browse blog posts and view article details.
- Create, edit, and delete blog posts.
- Secure login and session management for administrators.

## Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL database

### Environment Variables

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog"
PORT=3000
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### Installation

1. **Install dependencies:**
   ```bash
   # Server
   cd server && npm install
   
   # Client
   cd ../client && npm install
   ```

2. **Database Setup:**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed
   ```

### Running the Application

1. **Start Server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Client:**
   ```bash
   cd client
   npm run dev
   ```
