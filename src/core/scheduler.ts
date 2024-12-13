import {AccountModel} from '@/models/account.model';
import {logger} from '@/utils/logger';
import cron from 'node-cron';

export const expiredTokensScheduler = () =>
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Removing expired refresh tokens...');
      await AccountModel.removeExpiredTokens();
      logger.info('Expired refresh tokens removed');
    } catch (err) {
      logger.error(err);
    }
  });
