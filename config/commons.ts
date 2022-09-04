type FieldError = {
  name: string;
  errors: string[];
};

export interface ResponsePayload {
  success: boolean;
  statusCode: number;
  message?: string;
  errorDetail?: string;
  token?: string;
  data?: Record<string, unknown> | any;
  redirectUrl?: string;
  errorFields?: FieldError[];
  errorCode?: string;
}
