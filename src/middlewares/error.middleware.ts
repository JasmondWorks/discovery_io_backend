import { NextFunction, Request, Response } from "express";
import config from "../config/app.config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // 1. Handle Mongoose / DB Connection Errors specifically
  if (
    err.name === "MongooseError" ||
    err.message?.includes("buffering timed out")
  ) {
    error.message =
      "The server is having trouble connecting to the database. Please try again in a few moments.";
    error.statusCode = 503; // Service Unavailable
  }

  // 2. Handle Invalid Database IDs (CastError)
  if (err.name === "CastError") {
    error.message = `Invalid value for field: ${err.path}`;
    error.statusCode = 400;
  }

  // 3. Handle Duplicate Key Errors (e.g. unique field violation)
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    error.message = `Duplicate field value: ${value}. Please use another value!`;
    error.statusCode = 400;
  }

  // 4. Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    error.message = `Invalid input data. ${errors.join(". ")}`;
    error.statusCode = 400;
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (config.env === "development") {
    // Send detailed error but sanitized for common system errors
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      error: {
        statusCode: error.statusCode,
        status: error.status,
      },
      stack: error.stack,
    });
  } else {
    // Production: consistent user-friendly output
    const message = err.isOperational
      ? error.message
      : "Something went very wrong!";

    if (!err.isOperational) {
      console.error("ERROR 💥", err);
    }

    res.status(error.statusCode).json({
      status: error.status,
      message: message,
    });
  }
};
