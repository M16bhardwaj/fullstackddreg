import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

import { AppError } from "../utils/errorHandler";
import { AppResponse } from "../utils/response";
import { env, logger } from "../config";

export class ErrorMiddleware {
  public static handleError(
    error: Error | AppError,
    req: Request,
    res: Response,
    _: NextFunction
  ): void {
    let statusCode = (error as AppError).statusCode || 500;
    let message = (error as AppError).message || "Internal Server Error";

    let errors: Record<string, string> | undefined;

    // zod validation error
    if (error instanceof ZodError) {
      statusCode = 400;
      message = "Validation Error";
      errors = Object.fromEntries(
        Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.join(", ") || "",
        ])
      );
      logger.error("Zod Error: ",errors);
    }

    // mongodb validation error
    else if (error instanceof mongoose.Error.ValidationError) {
      statusCode = 400;
      message = "Validation Error";
      errors = Object.fromEntries(
        Object.entries(error.errors).map(([key, value]) => [key, value.message])
      );
      logger.error("Mongoose Validation Error: ", error.errors);
    }

    // mongoose cast error
    else if (error instanceof mongoose.Error.CastError) {
      statusCode = 400;
      message = "Invalid ID";
      errors = { [error.path || ""]: "Invalid ID" };
      logger.error("Mongoose Cast Error: ", error);
    }

    // mongoose duplicate key error
    else if (error instanceof mongoose.Error) {
      statusCode = 400;
      message = "Duplicate Key Error";
      errors = Object.fromEntries(
        Object.entries((error as any).keyValue).map(([key, value]) => [
          key,
          `${key} already exists`,
        ])
      );
      logger.error("Mongoose Duplicate Key Error: ", error);
    } else {
      // handle other errors
      if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errors = error.errors;
        logger.error("AppError: ", error);
      } else {
        logger.error("Error: ", error);
      }
    }

    if (env.NODE_ENV !== "production") {
      logger.error("Error: ", error);
      logger.error("Request: ", {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
      });
    }

    AppResponse.error(res, message, statusCode);
  }

  public static handleUnhandledRejection(): void {
    process.on(
      "unhandledRejection",
      (reason: unknown, promise: Promise<unknown>) => {
        if (reason instanceof Error) {
          logger.error(
            "Unhandled Rejection at:",
            promise,
            "reason:",
            reason.message
          );
        } else {
          logger.error("Unhandled Rejection at:", promise, "reason:", reason);
        }
        process.exit(1);
      }
    );
  }

  public static handleUncaughtException(): void {
    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception thrown:", error.message);
      process.exit(1);
    });
  }
}
