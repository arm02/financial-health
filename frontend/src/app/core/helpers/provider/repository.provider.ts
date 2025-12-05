import { HttpAuthRepository } from '../../../data/repository/http-auth.repository';
import { AuthRepository } from '../../repository/auth.repository';

export const HttpProvider = [
  {
    provide: AuthRepository,
    useClass: HttpAuthRepository,
  },
];
