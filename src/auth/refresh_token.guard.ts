import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import * as lodash from 'lodash';

import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private refreshTokenService: RefreshTokenService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshTokenCookie = request?.cookies['auth_cookie'];
    if (!refreshTokenCookie) {
      return false;
    }
    const decodedToken = await this.validateRefreshToken(refreshTokenCookie);

    if (!decodedToken) {
      return false;
    }

    const user: User = await this.userService.findOneByUsername(
      decodedToken.username,
    );

    if (!user) {
      return false;
    }

    request.user = {
      id: decodedToken.sub,
      username: decodedToken.username,
    };

    return true;
  }

  async validateRefreshToken(refreshTokenString: string) {
    try {
      const payload = await this.refreshTokenService.verify(refreshTokenString);

      const isSameRefreshToken = await this.checkUserRefreshTokenInDatabase(
        payload,
      );

      if (!isSameRefreshToken) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error(error.message);

      return null;
    }
  }

  async checkUserRefreshTokenInDatabase(payload) {
    const user: User = await this.userService.findOneByUsername(
      payload.username,
    );

    if (!user) {
      return false;
    }

    const payloadDB = await this.refreshTokenService.verify(user.refreshToken);

    const isMatchingWithDB: boolean = lodash.isEqual(payloadDB, payload);

    return isMatchingWithDB;
  }
}
