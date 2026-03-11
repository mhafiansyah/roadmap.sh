import axios from 'axios';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import { createClient } from 'redis';

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;
const API_KEY = process.env.VISUAL_CROSSING_API;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const TTL = Number(process.env.CACHE_TTL) || 300;

const app = express();

interface IWeatherData {
  location: string;
  datetime?: string;
  temp: number;
  cache?: boolean;
  error?: string;
}

const fetchApi = async (city: string): Promise<IWeatherData> => {
  const cacheKey = city;

  // check if cache is exist
  const redisClient = await createClient({ url: REDIS_URL })
    .on('error', (err) => console.log('Redis client error', err))
    .connect();

  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return { ...JSON.parse(cachedData), cache: true };
  }

  // fetch from api if there is no cache
  try {
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`;
    const response = await axios.get(URL);
    const data = response.data;
    if (!data || !data.address) {
      throw new Error(`City not found: ${city}`);
    }
    const todayData = data.days?.[0];

    const weatherData = {
      location: data?.resolvedAddress || data?.address,
      datetime: todayData?.datetime ?? 'N/A',
      temp: todayData?.temp ?? 0,
    };

    // set cache with value from api results
    await redisClient.setEx(cacheKey, TTL, JSON.stringify(weatherData));

    return { ...weatherData, cache: false };
  } catch (error) {
    return {
      location: city,
      temp: 0,
      error: 'Something went wrong while fetching from API',
    };
  }
};

app.get('/', (res: Response) => {
  res.send('Welcome!');
});

app.get('/weather', async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    res.status(400).json({ error: 'City parameter is required' });
  }

  const data = await fetchApi(city);
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
