import { Request, Response } from "express";

/**
 * Handles GET /health. Responds with { status: {status} }.
 * @param req - Express request
 * @param res - Express response
 */
const getHealthController = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.json({ status: req.i18n.t("healthy", { ns: "word" }) });
};

export { getHealthController };
