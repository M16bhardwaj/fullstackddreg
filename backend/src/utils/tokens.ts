import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import {env} from '../config'

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export interface TokenPayload {
  userId: string;
}

export class TokenUtils {
  public static generateToken(
    payload: TokenPayload,
    expiresIn: string | number = '1h'
  ): string {
    const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  public static verifyToken<T = TokenPayload>(token: string): T {
    return jwt.verify(token, env.JWT_SECRET) as T;
  }

  public static decodeToken(token: string): null | JwtPayload | string {
    return jwt.decode(token);
  }
}
