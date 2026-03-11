import { API_KEY, TTL } from '@/config/env.js';
import { redisClient, redisConnect } from '@/services/redis.service.js';
import type { IWeatherData } from '@/types/weather.js';
import axios from 'axios';

export const getWeatherData = async (city: string): Promise<IWeatherData> => {
  const cacheKey = city;

  // check if cache is exist
  await redisConnect();

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
