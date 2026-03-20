import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  'e848db3b47247b2bb224869ed5369d721cda59bb7f70b7c23123af5f0ca67712';
