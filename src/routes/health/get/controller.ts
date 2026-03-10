import { STATUS_CODES } from "@/constants/status-codes";
import { TResponseBody } from "@/types/response";
import { Request, Response } from "express";
import { TGetHealthResponseData, TGetHealthResponseErrorCode } from "./schema";

/**
 * Handles GET /health. Responds with { data: { status } } using TResponseBody.
 * @param req - Express request (uses req.i18n for status message).
 * @param res - Express response.
 * @returns The Express response.
 */
const getHealthController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const responseBody: TResponseBody<
    TGetHealthResponseData,
    TGetHealthResponseErrorCode
  > = {
    data: {
      status: req.i18n.t("healthy", { ns: "word" }),
    },
  };
  return res.status(STATUS_CODES.OK).json(responseBody);
};

export { getHealthController };
