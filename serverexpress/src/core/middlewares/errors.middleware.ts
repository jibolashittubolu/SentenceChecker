/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { 
  appendError,
  errorFactory,
  logger
} from "../../utils"; 

class ErrorHandler {
  public async handle(err: Error, req: Request, res: Response, next: NextFunction) {
    const newError = errorFactory(err);

    let { message, status, meta } = newError;

    const error = appendError(req, newError);

    // await sendEventsToSentry();

    if (error.isOperational) {
      res.status(error.httpCode).send({ status, message, meta });

      logger.error(
        "Trusted Error:",
        error
      );
    } else {
      // await sendMailToAdminIfCritical();

      if (error.httpCode === 500) {
        message = "Internal Server Error";
      }

      res.status(error.httpCode).send({ status, meta, message });

      logger.fatal(
        "Untrusted Error:",
        error
      );
    }
    next();
  }

  public async handleRejection(err: any) {
    // await sendMailToAdminIfCritical();

    logger.fatal(
      "Rejection Error:",
      err
    );
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
