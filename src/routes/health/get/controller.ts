import { Request, Response } from "express";

const getHealthController = async (req: Request, res: Response) => {
  res.json({ status: req.i18n.t("healthy", { ns: "word" }) });
};

export { getHealthController };
