/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-param-last */
import { Response } from "express";
import { HttpStatusCode } from "./ErrorHandling";

const status = "success";

const successResponse = (
  res: Response,
  statusCode: HttpStatusCode,
  message: string,
  data: unknown = [],
  meta?: any
) => {
  const responseObject = {
    status, message, data, meta
  };
  return res.status(statusCode).send(responseObject);
};

export default successResponse;
