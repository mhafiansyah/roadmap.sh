export interface IWeatherData {
  location: string;
  datetime?: string;
  temp: number;
  cache?: boolean;
  error?: string;
}
