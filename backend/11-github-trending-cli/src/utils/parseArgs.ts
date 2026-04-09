import * as T from '@/types/cli.types.js';

const isValidDuration = (d: string): d is T.TDurationOptions => {
  return (T.VALID_DURATIONS as readonly string[]).includes(d);
};

export const parseArguments = (args: string[]): T.TCliOptions => {
  const options: T.TCliOptions = {
    duration: 'week',
    limit: 10,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = args[i + 1];

    if (arg === '--duration') {
      if (value !== undefined && isValidDuration(value)) {
        options.duration = value;
      } else {
        console.error(
          `Invalid duration, Expected :${T.VALID_DURATIONS.join(', ')}`,
        );
      }
    } else if (arg === '--limit') {
      const parsedValue = Number(value);

      if (value !== undefined && !isNaN(parsedValue) && parsedValue <= 30) {
        options.limit = parsedValue;
      } else {
        console.error('limit need to be a number and less than 30');
      }
    }
  }

  return options;
};
