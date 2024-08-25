/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;

// import { Request, Response, NextFunction } from "express";

// const catchAsync = (
//   fn: (req: Request, res: Response, next: NextFunction) => any
//   // fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
// ) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };

// export default catchAsync;
