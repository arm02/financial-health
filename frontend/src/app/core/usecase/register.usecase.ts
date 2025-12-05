import { inject, Injectable } from '@angular/core';
import { UseCase } from '../base/usecase';
import { AuthRepository } from '../repository/auth.repository';
import { Observable } from 'rxjs';
import { AuthDTO } from '../domain/dto/auth.dto';
import { RegisterResponse } from '../domain/entities/auth.entities';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCase implements UseCase<AuthDTO, RegisterResponse> {
  private repository = inject(AuthRepository);

  execute(params: AuthDTO): Observable<RegisterResponse> {
    return this.repository.Register(params);
  }
}
