import { inject, Injectable } from '@angular/core';
import { UseCase } from '../base/usecase';
import { AuthRepository } from '../repository/auth.repository';
import { Observable } from 'rxjs';
import { LoginDTO } from '../domain/dto/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase implements UseCase<any, any> {
  private repository = inject(AuthRepository);

  execute(params: LoginDTO): Observable<any> {
    return this.repository.Login(params.email, params.password);
  }
}
