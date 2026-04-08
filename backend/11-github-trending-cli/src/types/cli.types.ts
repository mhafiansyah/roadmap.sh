export type TDurationOptions = 'day' | 'week' | 'month' | 'year';

export type TCliOptions = {
  duration: TDurationOptions;
  limit: number;
};
