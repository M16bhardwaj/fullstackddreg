import { Request, Response, NextFunction } from "express";
import { TokenUtils,TokenPayload } from "../utils/tokens";
import { AppResponse } from "../utils/response";

declare module 'express' {
    interface Request {
        user?:{
          userId:string
        }
    }
  }

export class AuthMiddleware {
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    AppResponse.error(res, "Authorization token missing", 401);
    return
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = TokenUtils.verifyToken(token);
      req.user = payload;
      next();
    } catch (error) {
      AppResponse.error(res, "Invalid or expired token", 401);
    }
  }
}
