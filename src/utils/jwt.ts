import {env} from '@/core/envConfig';
import type {SecretType, SigningContentType} from '@/core/types';
import jwt, {type JwtPayload} from 'jsonwebtoken';

const calculateExpirationTime = (expiresIn: string | number): Date => {
  const expirationDate = new Date();

  if (typeof expiresIn === 'number') {
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    return expirationDate;
  }
  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }
  const [_, value, unit] = match;
  const timeMultiplier: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  const secondsToAdd = Number.parseInt(value, 10) * (timeMultiplier[unit] || 0);
  expirationDate.setSeconds(expirationDate.getSeconds() + secondsToAdd);

  return expirationDate;
};

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

export const generateAuthTokens = async (
  data: Required<SigningContentType>,
) => {
  const refreshTokenExpiration = calculateExpirationTime(
    env.JWT_REFRESH_EXPIRY,
  );
  const accessToken = generateToken(data, 'access', env.JWT_ACCESS_EXPIRY);
  const refreshToken = generateToken(data, 'refresh', env.JWT_REFRESH_EXPIRY);
  return {accessToken, refreshToken, refreshTokenExpiration};
};
