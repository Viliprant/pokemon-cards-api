import { User } from '../entities/user.entity';

export class SafeUser {
  id: string;
  username: string;
  mail: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.mail = user.mail;
  }
}
