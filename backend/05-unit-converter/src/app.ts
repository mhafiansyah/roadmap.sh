import express from "express";
import cors from 'cors';
import convertRoutes from './routes/convert.routes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', convertRoutes);

export { app };