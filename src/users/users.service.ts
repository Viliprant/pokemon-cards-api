import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private readonly users: User[] = [];

  async findOneByID(id: number): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ username });
  }

  async findOneByMail(mail: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ mail });
  }

  async updateRefreshToken(userID: number, newRefreshToken: string) {
    const user: User = await this.findOneByID(userID);

    user.refreshToken = newRefreshToken;

    return this.userRepository.save(user);
  }

  async createUser(newUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds: number = +(await this.configService.get<number>(
      'SAlT_OR_ROUNDS',
    ));

    const hashPassword = await bcrypt.hash(newUserDto.password, saltOrRounds);

    const newUser: User = this.userRepository.create({
      username: newUserDto.username,
      mail: newUserDto.mail,
      password: hashPassword,
      refreshToken: null,
    });

    return this.userRepository.save(newUser);
  }
}
