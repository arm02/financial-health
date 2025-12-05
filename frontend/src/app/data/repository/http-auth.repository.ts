import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../core/repository/auth.repository';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/helpers/services/http.service';

@Injectable({ providedIn: 'root' })
export class HttpAuthRepository implements AuthRepository {
  private http = inject(HttpService);

  Login(email: string, password: string): Observable<any> {
    return this.http.Post(`login`, { email, password });
  }
}
