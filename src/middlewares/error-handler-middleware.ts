import { STATUS_CODES } from "@/constants/status-codes";
import { TResponseBody } from "@/types/response-body";
import { NextFunction, Request, Response } from "express";

/**
 * Returns the request's query string per URL Standard: includes leading "?" or "".
 * Uses the URL API for consistent parsing.
 */
function getRequestSearch(req: Request): string | undefined {
  try {
    const base = `http://${req.get("host") ?? req.hostname}`;
    const url = new URL(req.originalUrl, base);
    return url.search;
  } catch {
    const idx = req.originalUrl.indexOf("?");
    return idx === -1 ? undefined : req.originalUrl.slice(idx);
  }
}

/**
 * Error handler middleware to handle errors and log them to the console.
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
const errorHandlerMiddleware = async (
  err: { statusCode?: number; message?: string; stack?: string; url?: string },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  try {
    const statusCode = err.statusCode ?? STATUS_CODES.INTERNAL_SERVER_ERROR;

    console.error("Error while logging error:", {
      data: {
        statusCode,
        errorMessage: err.message ?? "Internal Server Error",
        errorStack: err.stack,
        // userId: req.sessionUser?.id,
        url: req.url,
        urlDomain: req.hostname,
        urlPath: req.path,
        urlSearch: getRequestSearch(req),
        requestBody: JSON.stringify(req?.body),
        requestMethod: req?.method,
        // createdBy: req.sessionUser?.id,
      },
    });

    const responseBody: TResponseBody<undefined> = {
      error: {
        code: statusCode.toString(),
        message: err.message ?? "Internal Server Error",
      },
    };

    return res.status(statusCode).json(responseBody);
  } catch (error) {
    console.error("Error while logging error:", error);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: {
        code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString(),
        message: "Internal Server Error",
      },
    });
  }
};

export { errorHandlerMiddleware };
