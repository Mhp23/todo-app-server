import {env} from '@/core/envConfig';
import {app} from '@/server';
import {logger} from '@/utils/logger';
import connectToDB from './core/db';
import {expiredTokensScheduler} from './core/scheduler';

connectToDB().then(() => {
  const server = app.listen(env.PORT, () => {
    const {NODE_ENV, HOST, PORT} = env;
    logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
  });

  const onCloseSignal = async () => {
    logger.info('sigint received, shutting down');

    server.close(() => {
      logger.info('server closed');
      process.exit();
    });

    setTimeout(() => process.exit(1), 10000).unref();
  };

  expiredTokensScheduler();

  process.on('SIGINT', onCloseSignal);
  process.on('SIGTERM', onCloseSignal);
});
