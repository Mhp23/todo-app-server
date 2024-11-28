import {env} from '@/core/envConfig';
import type {SecretType} from '@/core/types';
import jwt, {type JwtPayload} from 'jsonwebtoken';

const getSecret = (type: SecretType) =>
  type === 'access' ? env.JWT_ACCESS_SECRET! : env.JWT_REFRESH_SECRET!;

export const generateToken = (
  payload: string | Buffer | object,
  type: SecretType,
  expiresIn: string | number,
) => {
  const secret = getSecret(type);
  return jwt.sign(payload, secret, {expiresIn});
};

export const verifyToken = <T>(token: string, type: SecretType) => {
  try {
    const secret = getSecret(type);
    return jwt.verify(token, secret) as JwtPayload & T;
  } catch {
    return null;
  }
};
