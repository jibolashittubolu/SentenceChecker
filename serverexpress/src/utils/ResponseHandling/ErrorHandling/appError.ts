/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from "./baseError";

class AppError extends Error {
  public httpCode: HttpStatusCode;

  public isOperational: boolean;

  public status: string;

  public meta: any;

  constructor(httpCode: HttpStatusCode, message: string, meta?: any, isOperational = true) {
    super(message);

    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.status = `${httpCode}`.startsWith("4") ? "failed" : "error";
    this.meta = meta;

    Error.captureStackTrace(this);
  }
}

export default AppError;
