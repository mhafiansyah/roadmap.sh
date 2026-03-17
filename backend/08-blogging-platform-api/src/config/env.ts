import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
