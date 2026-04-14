import type { RequestHandler } from 'express';

const colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const colorize = (text: string, color: string) => {
  return `${color}${text}${colors.reset}`;
};

const getStatusColor = (statusCode: number) => {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.blue;
  return colors.green;
};

const getCacheColor = (cacheStatus: string) => {
  if (cacheStatus === 'HIT') return colors.green;
  if (cacheStatus === 'MISS') return colors.yellow;
  return colors.gray;
};

export const logger: RequestHandler = (req, res, next) => {
  const startedAt = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - startedAt;
    const cacheStatus = String(res.getHeader('X-Cache') ?? 'BYPASS');
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const methodLabel = colorize(method.padEnd(6), colors.cyan);
    const statusLabel = colorize(
      String(statusCode).padEnd(3),
      getStatusColor(statusCode),
    );
    const durationLabel = `${duration.toFixed(2).padStart(8)} ms`;
    const cacheLabel = colorize(
      cacheStatus.padEnd(6),
      getCacheColor(cacheStatus),
    );

    console.log(
      `${methodLabel} ${statusLabel} ${durationLabel} cache=${cacheLabel} ${originalUrl}`,
    );
  });

  next();
};
