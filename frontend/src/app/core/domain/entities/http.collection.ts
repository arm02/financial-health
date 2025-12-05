export interface HttpResponse<T> {
  code: number;
  data: T;
  message: string;
  status: true;
}

export interface ErrorResponse {
  code: number;
  error: string;
  error_code: string;
  message: string;
  status: boolean;
  type: string;
}
