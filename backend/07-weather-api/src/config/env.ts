import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const API_KEY = process.env.VISUAL_CROSSING_API;
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const TTL = Number(process.env.CACHE_TTL) || 300;
