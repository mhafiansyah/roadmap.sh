import { getWeatherData } from '@/services/weather.service.js';
import express, { type Request, type Response } from 'express';

const app = express();

app.get('/weather', async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    res.status(400).json({ error: 'City parameter is required' });
  }

  const data = await getWeatherData(city);
  res.send(data);
});

export default app;
