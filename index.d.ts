import type {SigningContentType} from './src/core/types';

declare global {
  namespace Express {
    interface Request {
      account?: SigningContentType;
    }
  }
}
