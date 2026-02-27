/** Nested map of field paths to error messages (supports nested validation). */
export type TValidationError = {
  [key: string]: string | TValidationError;
};

/**
 * Standard API response shape. Exactly one of data, validationErrors, or error
 * is typically present depending on outcome.
 *
 * @template TModel - Type of the success payload when data is present
 * @template TErrorCode - String literal type for error.code
 */
export type TResponseBody<TModel, TErrorCode extends string = string> = {
  /** Present on success */
  data?: TModel;
  /** Present when validation failed (e.g. request body) */
  validationErrors?: TValidationError;
  /** Present when an error occurred */
  error?: { code: TErrorCode; message: string };
};
