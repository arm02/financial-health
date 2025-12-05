import { inject, Injectable } from '@angular/core';
import { UseCase } from '../base/usecase';
import { AuthRepository } from '../repository/auth.repository';
import { Observable } from 'rxjs';
import { AuthDTO } from '../domain/dto/auth.dto';
import { LoginResponse } from '../domain/entities/auth.entities';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase implements UseCase<AuthDTO, LoginResponse> {
  private repository = inject(AuthRepository);

  execute(params: AuthDTO): Observable<LoginResponse> {
    return this.repository.Login(params);
  }
}
