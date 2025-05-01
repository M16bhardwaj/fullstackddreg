import type { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError, ZodSchema } from "zod";
import { logger } from "../config";

import { AppResponse } from "../utils/response";

export class ValidationMiddleware {
  public static validate = <T>(schema: ZodSchema<T>, coming_from: 'QUERY'| 'BODY'|'PARAMS' = 'BODY') =>
     async (req: Request, res:Response, next:NextFunction): Promise<void> =>{
        try {
          const result = schema.safeParse(
            coming_from === 'BODY' ? req.body : coming_from === 'QUERY' ? req.query : req.params
          )
          if (!result.success) {
            const errorMessages: Record<string, string> = {};
            result.error.errors.forEach((err) => {
              errorMessages[err?.path[0]] = err.message;
            });
            AppResponse.error(res, errorMessages, 400);
          }
          next();
        } catch (error) {
            logger.error("Validation Error: ", error);
            if(error instanceof Error && error.hasOwnProperty("errors")){
              AppResponse.error(res, (error as any).errors[0], 400);
            } else{
              AppResponse.error(res, "An unexpected error occurred.", 500);
            }
        }
  }
}
