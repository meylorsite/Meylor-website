import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any,
  };
  return jwt.sign(payload as object, process.env.JWT_ACCESS_SECRET!, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  };
  return jwt.sign(payload as object, process.env.JWT_REFRESH_SECRET!, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
};
