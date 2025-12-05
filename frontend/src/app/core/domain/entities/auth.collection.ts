import { HttpResponse } from './http.collection';
export interface LoginData {
  email: string;
  fullname: string;
  token: string;
}

export type LoginResponse = HttpResponse<LoginData>;


export interface RegisterData {
  email: string;
  fullname: string;
  password: string;
}

export type RegisterResponse = HttpResponse<RegisterData>;
