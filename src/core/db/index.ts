import {env} from '@/core/envConfig';
import {logger} from '@/utils/logger';
import mongoose from 'mongoose';

const connectToDB = async () => {
  try {
    await mongoose.connect(env.MONGO_CONNECTION_URI);
  } catch (e: any) {
    logger.error(`Mongoose connection error: ${e.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('Mongoose reconnected');
});

mongoose.connection.on('connecting', () => {
  logger.info('Mongoose is connecting...');
});

mongoose.connection.on('close', () => {
  logger.info('Mongoose connection closed');
});

export default connectToDB;
