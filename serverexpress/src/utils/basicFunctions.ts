/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import {
  AppError,
  BaseError,
  HttpStatusCode
} from "./ResponseHandling";



// This funtion is for checking the environment
export function isDevEnvironment() {
  const env = process.env.APP_ENVIRONMENT;
  return env === "development";
}

// This funtion is for checking the environment
export function isStagingEnvironment() {
  const env = process.env.APP_ENVIRONMENT;
  return env === "staging";
}

// This funtion is for checking the environment
export function isProductionEnvironment() {
  const env = process.env.APP_ENVIRONMENT;
  return env === "production";
}

export function returnAppEnvironment() {
  const env = process.env.APP_ENVIRONMENT;
  return env;
}

// Error handling functions

// Includes the required data in the error
export function appendError(req: Request, err: any) {
  err.path = req.path;
  err.body = req.body;
  err.query = req.query;
  err.params = req.params;
  // err.user_Profile = req.profile;

  return err;
}

// determines the right error type
export function errorFactory(err: Error) {
  if (err instanceof AppError) {
    return err;
  }

  const base_error = new BaseError(HttpStatusCode.INTERNAL_SERVER, err);
  return base_error;
}
