import { Observable } from 'rxjs';
import { LoginDTO } from '../domain/dto/auth.dto';
import { LoginResponse } from '../domain/entities/auth.collection';

export abstract class AuthRepository {
  abstract Login(body: LoginDTO): Observable<LoginResponse>;
}
