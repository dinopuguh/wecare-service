import { User } from '../../../models/User';

export class LoginResponse extends User {
  accessToken: string;
}
