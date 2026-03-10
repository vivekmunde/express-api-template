import { TResponseErrorCode } from "@/types/response";

/** Health check success payload. */
export type TGetHealthResponseData = {
  /** Translated health status label. */
  status: string;
};

export type TGetHealthResponseErrorCode = TResponseErrorCode;
