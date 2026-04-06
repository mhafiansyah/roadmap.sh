import { loadEnvFile } from 'node:process';

loadEnvFile('.env');

export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
