export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

export type ApiFailure = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
