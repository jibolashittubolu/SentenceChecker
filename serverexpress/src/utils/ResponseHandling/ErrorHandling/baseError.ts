/* eslint-disable @typescript-eslint/no-explicit-any */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  RESET = 205,
  BAD_REQUEST = 400,
  UNAUTHORISED = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER = 500,
}

export class BaseError extends Error {
  public httpCode: HttpStatusCode;

  public isOperational: boolean;

  public status: string;

  public meta: any;

  constructor(httpCode: HttpStatusCode, error: Error) {
    super(error.message);

    this.httpCode = httpCode;
    this.isOperational = false;
    this.status = "error";

    Error.captureStackTrace(this);
  }
}
