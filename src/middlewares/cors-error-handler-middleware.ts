import { STATUS_CODES } from "@/constants/status-codes";
import { NextFunction, Request, Response } from "express";

const corsErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (err.message === "NOT_ALLOWED_BY_CORS") {
      return res.status(STATUS_CODES.FORBIDDEN).json({});
    }

    next(err);
  } catch (error) {
    next(error);
  }
};

export { corsErrorHandlerMiddleware };
