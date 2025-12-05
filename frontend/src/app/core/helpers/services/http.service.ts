import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  private getHeaders(customHeaders?: Record<string, string>): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(customHeaders ?? {}),
    });

    return headers;
  }

  Get<T>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${url}`, {
      headers: this.getHeaders(headers),
      params: new HttpParams({ fromObject: params || {} }),
      withCredentials: true,
    });
  }

  Post<T>(url: string, body: any, headers?: Record<string, string>): Observable<T> {
    return this.http.post<T>(`${this.API_URL}/${url}`, body, {
      headers: this.getHeaders(headers),
      withCredentials: true,
    });
  }

  Put<T>(url: string, body: any, headers?: Record<string, string>): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${url}`, body, {
      headers: this.getHeaders(headers),
      withCredentials: true,
    });
  }

  Delete<T>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}/${url}`, {
      headers: this.getHeaders(headers),
      params: new HttpParams({ fromObject: params || {} }),
      withCredentials: true,
    });
  }
}
