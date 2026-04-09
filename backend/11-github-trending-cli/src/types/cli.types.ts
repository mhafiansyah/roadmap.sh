export const VALID_DURATIONS = ['day', 'week', 'month', 'year'] as const;
export type TDurationOptions = (typeof VALID_DURATIONS)[number];

export type TCliOptions = {
  duration: TDurationOptions;
  limit: number;
};
