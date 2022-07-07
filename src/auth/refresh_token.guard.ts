import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private refreshTokenService: RefreshTokenService,
    private userService: UsersService,
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

  async validateRefreshToken(refreshTokenCookie: string) {
    const token = JSON.parse(refreshTokenCookie);
    try {
      const payload = await this.refreshTokenService.verify(
        token.refresh_token,
      );

      return payload;
    } catch (error) {
      console.error(error.message);

      return null;
    }
  }
}
