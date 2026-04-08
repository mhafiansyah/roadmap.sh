import type { TDurationOptions } from '@/types/cli.types.js';

export const getDateConvert = (duration: TDurationOptions) => {
  const date = new Date();

  switch (duration) {
    case 'day':
      date.setDate(date.getDate() - 1);
      break;

    case 'week':
      date.setDate(date.getDate() - 7);
      break;

    case 'month':
      date.setDate(date.getMonth() - 1);
      break;

    case 'year':
      date.setDate(date.getFullYear() - 1);
      break;
  }

  return date.toISOString().split('T')[0];
};
