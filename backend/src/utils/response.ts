import { Response } from "express";

type SuccessData<T = {}> ={
  success: true,
  message?: string,
  data: T
}

type ErrorData = {
  success: false,
  message: string | Record<string,string>,
  statusCode: number
}

export class AppResponse {
  static success<T>(res: Response, data: T, message: string = "Success") {
    const response: SuccessData<T> = {
      success: true,
      message,
      data,
    }
    return res.status(200).json(response);
  }

  static error(res: Response, message: string | Record<string,string>, statusCode: number = 500) {
    const response: ErrorData = {
      success: false,
      message: message,
      statusCode,
    }
    return res.status(statusCode).json(response);
  }
}