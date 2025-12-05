import { Observable } from 'rxjs';

export abstract class AuthRepository {
  abstract Login(email: string, password: string): Observable<any>;
}
