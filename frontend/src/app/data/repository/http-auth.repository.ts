import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../core/repository/auth.repository';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/helpers/services/http.service';
import { LoginDTO } from '../../core/domain/dto/auth.dto';
import { LoginResponse } from '../../core/domain/entities/auth.collection';

@Injectable({ providedIn: 'root' })
export class HttpAuthRepository implements AuthRepository {
  private http = inject(HttpService);

  Login(body: LoginDTO): Observable<LoginResponse> {
    return this.http.Post(`login`, body);
  }
}
