export type TValidationError = {
  [key: string]: string | TValidationError;
};

export type TResponseBody<TModel, TErrorCode extends string = string> = {
  data?: TModel;
  validationErrors?: TValidationError;
  error?: { code: TErrorCode; message: string };
};
