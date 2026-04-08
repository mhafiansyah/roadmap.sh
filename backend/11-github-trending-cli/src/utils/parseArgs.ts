import type { TCliOptions, TDurationOptions } from '@/types/cli.types.js';

const isValidDuration = (d: string): d is TDurationOptions => {
  return ['day', 'week', 'month', 'year'].includes(d);
};

export const parseArguments = (args: string[]): TCliOptions => {
  const options: TCliOptions = {
    duration: 'week',
    limit: 10,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = args[i + 1];

    if (arg === '--duration' && value !== undefined && isValidDuration(value)) {
      options.duration = value;
    }

    if (
      arg === '--limit' &&
      value !== undefined &&
      Number.isInteger(Number(value))
    ) {
      options.limit = Number(value);
    }
  }

  return options;
};
