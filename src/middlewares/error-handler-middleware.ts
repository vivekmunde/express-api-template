import { STATUS_CODES } from "@/constants/status-codes";
import { prisma } from "@/prisma";
import { TResponseBody } from "@/types/response-body";
import { NextFunction, Request, Response } from "express";

/**
 * Error handler middleware. Logs error details (status, message, stack, URL, body, method)
 * and sends a JSON response with statusCode and error message. On logging failure,
 * responds with 500 and a generic message.
 *
 * @param err - Error with optional statusCode, message, stack, url
 * @param req - Express request
 * @param res - Express response
 * @param next - Next function (unused; required for Express error middleware signature)
 * @returns The response body with the error details
 */
const errorHandlerMiddleware = async (
  err: { statusCode?: number; message?: string; stack?: string; url?: string },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Promise<Response> => {
  try {
    const statusCode = err.statusCode ?? STATUS_CODES.INTERNAL_SERVER_ERROR;

    await prisma.apiErrorLog.create({
      data: {
        service: "AUTH",
        statusCode: statusCode,
        errorMessage: err.message ?? "Internal Server Error",
        errorStack: err.stack,
        requestUrl: req.url.toString(),
        requestUrlHostname: req.hostname,
        requestUrlPath: req.path,
        requestUrlSearch: new URL(req.url.toString()).search.slice(1),
        requestBody: JSON.stringify(req?.body),
        requestMethod: req?.method,
        userId: req.sessionUser?.id,
        createdBy: req.sessionUser?.id,
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
