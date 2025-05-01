export class AppError extends Error {
  public statusCode: number;
  public message: string;
  public errors?: Record<string, string>;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Record<string, string>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = true
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}