import { NextFunction, Request, Response } from "express";

/**
 * Eliminates the need for try-catch blocks in async express routes/middleware.
 * It wraps the async function and catches any errors, passing them to next().
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
