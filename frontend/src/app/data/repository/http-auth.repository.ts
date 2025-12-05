import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../core/repository/auth.repository';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/helpers/services/http.service';
import { AuthDTO } from '../../core/domain/dto/auth.dto';
import { LoginResponse, RegisterResponse } from '../../core/domain/entities/auth.entities';

@Injectable({ providedIn: 'root' })
export class HttpAuthRepository implements AuthRepository {
  private http = inject(HttpService);

  Login(body: AuthDTO): Observable<LoginResponse> {
    return this.http.Post(`login`, body);
  }

  Register(body: AuthDTO): Observable<RegisterResponse> {
    return this.http.Post(`register`, body);
  }
}
