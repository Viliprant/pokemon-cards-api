import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private readonly configService: ConfigService) {}

  private readonly users: User[] = [];

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findOneByMail(mail: string): Promise<User | undefined> {
    return this.users.find((user) => user.mail === mail);
  }

  async updateRefreshToken(userID: string, newRefreshToken: string) {
    const user: User = this.users.find((user) => user.id === userID);

    user.refreshToken = newRefreshToken;
  }

  async createUser(newUser: CreateUserDto): Promise<User> {
    const saltOrRounds: number = +(await this.configService.get<number>(
      'SAlT_OR_ROUNDS',
    ));

    const hashPassword = await bcrypt.hash(newUser.password, saltOrRounds);

    const user: User = {
      id: uuid(),
      username: newUser.username,
      mail: newUser.mail,
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      refreshToken: null,
    };

    this.users.push(user);

    return user;
  }
}
