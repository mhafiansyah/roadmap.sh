import { getWeatherData } from '@/services/weather.service.js';
import express, { type Request, type Response } from 'express';

const app = express();

app.get('/weather', async (req: Request, res: Response) => {
  const cityQuery = req.query.city;
  const date = req.query.date;

  if (!cityQuery) {
    res.status(400).json({ error: 'city parameter is required' });
    return;
  }

  // check date format: YYYY-MM-DD using regex
  if (date && (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
    res.status(400).json({ error: 'date format need to be YYYY-MM-DD' });
    return;
  }

  let cities: string[] = [];
  // handle multiple url parameter style
  if (Array.isArray(cityQuery)) {
    // handle ?city=A&city=B url parameters
    cities = cityQuery.map((city) => String(city));
  } else {
    // handle ?city=A,B
    cities = String(cityQuery)
      .split(',')
      .map((city) => city.trim());
  }

  try {
    const weatherData = await Promise.all(
      cities.map((city) => getWeatherData(city, date)),
    );
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'An unexpected server error occured' });
  }
});

export default app;
