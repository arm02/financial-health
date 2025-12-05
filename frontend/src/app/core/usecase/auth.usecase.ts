import { inject, Injectable } from '@angular/core';
import { UseCase } from '../base/usecase';
import { AuthRepository } from '../repository/auth.repository';
import { Observable } from 'rxjs';
import { LoginDTO } from '../domain/dto/auth.dto';
import { LoginResponse } from '../domain/entities/auth.collection';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase implements UseCase<LoginDTO, LoginResponse> {
  private repository = inject(AuthRepository);

  execute(params: LoginDTO): Observable<LoginResponse> {
    return this.repository.Login(params);
  }
}
