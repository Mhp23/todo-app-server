import dotenv from 'dotenv';
import {cleanEnv, host, num, port, str, testOnly} from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['development', 'production', 'test'],
  }),
  HOST: host({devDefault: testOnly('localhost')}),
  PORT: port({devDefault: testOnly(3000)}),
  CORS_ORIGIN: str({devDefault: testOnly('http://localhost:3000')}),
  SENSITIVE_RATE_LIMIT_WINDOW_MS: num({devDefault: testOnly(10)}),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({devDefault: testOnly(1000)}),
  COMMON_RATE_LIMIT_WINDOW_MS: num({devDefault: testOnly(1000)}),
  //Database
  MONGO_CONNECTION_URI: str({
    devDefault: testOnly('mongodb://localhost:27017/Go_Game_DB'),
  }),
  //Password Hash
  SALT_ROUNDS: num({devDefault: 10}),
  //JWT
  JWT_ACCESS_EXPIRY: str({devDefault: testOnly('30min')}),
  JWT_REFRESH_EXPIRY: str({devDefault: testOnly('15d')}),
  JWT_ACCESS_SECRET: str({devDefault: testOnly('MY_ACCESS_SECRET')}),
  JWT_REFRESH_SECRET: str({devDefault: testOnly('MY_REFRESH_SECRET')}),
});
