import { HttpResponse } from './http.collection';
export interface LoginData {
  email: string;
  fullname: string;
  token: string;
}

export type LoginResponse = HttpResponse<LoginData>;
