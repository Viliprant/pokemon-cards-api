import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SafeUser } from 'src/users/dto/safe-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(username: string, password: string) {
    const user: User = await this.usersService.findOneByUsername(username);
    if (!user) {
      return null;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return new SafeUser(user);
    }
    return null;
  }

  async login(user: User) {
    return this.createAccessToken(user);
  }

  async register(newUser: CreateUserDto) {
    const errors = await this.checkUserFields(newUser);
    if (errors.length > 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: errors,
          error: 'Conflict',
        },
        HttpStatus.CONFLICT,
      );
    }

    const createdUser: User = await this.usersService.createUser(newUser);

    this.eventEmitter.emit('user.created', createdUser);

    return this.createAccessToken(createdUser);
  }

  createAccessToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createRefreshToken(user): Promise<any> {
    const payload = {
      username: user.username,
      sub: user.id || user.sub,
      salt: randomBytes(16).toString('hex'),
    };

    return {
      refresh_token: await this.refreshTokenService.sign(payload),
    };
  }

  async checkMail(mail: string): Promise<string[]> {
    const errors: string[] = [];

    const mailAlreadyExist = await this.usersService.findOneByMail(mail);
    if (mailAlreadyExist) {
      errors.push('Ce mail est déjà utilisé.');
    }

    return errors;
  }

  async checkUsername(username: string): Promise<string[]> {
    const errors: string[] = [];

    const usernameAlreadyExist = await this.usersService.findOneByUsername(
      username,
    );

    if (usernameAlreadyExist) {
      errors.push("Ce nom d'utilisateur est déjà utilisé.");
    }

    return errors;
  }

  async checkUserFields(createUserDto: CreateUserDto): Promise<string[]> {
    const usernameErrors = await this.checkUsername(createUserDto.username);
    const mailErrors = await this.checkMail(createUserDto.mail);

    return [...usernameErrors, ...mailErrors];
  }
}
