import type {Request, Response} from 'express';

export enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
  Silent = 'silent',
}
export type SecretType = 'access' | 'refresh';

export type PinoCustomProps = {
  request: Request;
  response: Response;
  error: Error;
  responseBody: unknown;
};
