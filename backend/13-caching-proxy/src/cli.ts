import { startServer } from '@/server.js';
import * as cache from '@/services/redis.service.js';
import { InvalidArgumentError, program } from 'commander';

const parsePort = (value: string): number => {
  const port = Number(value);

  if (isNaN(port) || port <= 0) {
    throw new InvalidArgumentError('Port must be a positive number');
  }

  return port;
};

program
  .name('Caching Proxy Server')
  .description('CLI to start a caching proxy server');

program
  .command('start')
  .description('start the caching proxy server')
  .requiredOption(
    '-p, --port <number>',
    'port to run the caching server on',
    parsePort,
  )
  .requiredOption('-o, --origin <string>', 'origin server URL')
  .action(async (options: { port: number; origin: string }) => {
    try {
      await cache.connect();
      await startServer(options.port, options.origin);
    } catch (error) {
      console.error('Failed to start server: ', error);
      process.exit(1);
    }
  });

await program.parseAsync();
