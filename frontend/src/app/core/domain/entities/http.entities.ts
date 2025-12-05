export interface HttpResponse<T> {
  code: number;
  data: T;
  message: string;
  status: true;
}

export interface ListResponse<T> {
  page: number;
  limit: number;
  rows: T,
  total: number;
  total_pages: number;
}

export interface ErrorResponse {
  code: number;
  error: string;
  error_code: string;
  message: string;
  status: boolean;
  type: string;
}
