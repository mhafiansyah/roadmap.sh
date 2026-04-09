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
      if (value === undefined) {
        throw new Error('--duration requires a value');
      }

      if (!isValidDuration(value)) {
        throw new Error(
          `Invalid duration: "${value}". Expected one of: ${T.VALID_DURATIONS.join(', ')}`,
        );
      }

      options.duration = value;
      i++;
    } else if (arg === '--limit') {
      if (value === undefined) {
        throw new Error('--limit requires a numeric value');
      }

      const parsedValue = Number(value);

      if (isNaN(parsedValue)) {
        throw new Error(`Invalid limit: "${value}" is not a number`);
      }

      if (parsedValue < 1 || parsedValue > 30) {
        throw new Error('Limit must be a nubmer between 1 and 30');
      }

      options.limit = parsedValue;
      i++;
    }
  }

  return options;
};
