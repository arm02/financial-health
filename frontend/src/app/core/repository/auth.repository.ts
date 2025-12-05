import { Observable } from 'rxjs';
import { AuthDTO } from '../domain/dto/auth.dto';
import { LoginResponse, RegisterResponse } from '../domain/entities/auth.collection';

export abstract class AuthRepository {
  abstract Login(body: AuthDTO): Observable<LoginResponse>;
  abstract Register(body: AuthDTO): Observable<RegisterResponse>;
}
