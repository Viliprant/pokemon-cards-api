import { Controller, Request, Post, UseGuards, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../local-auth.guard';
import { RefreshTokenGuard } from '../refresh_token.guard';

@Controller()
export class LoginController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const newRefreshToken = await this.authService.createRefreshToken(req.user);
    const stringifiedCookie = JSON.stringify(newRefreshToken);

    response.cookie('auth_cookie', stringifiedCookie, {
      httpOnly: true,
    });

    return this.authService.login(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('auth/refresh_token')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newRefreshToken = await this.authService.createRefreshToken(req.user);
    const stringifiedCookie = JSON.stringify(newRefreshToken);

    response.cookie('auth_cookie', stringifiedCookie, {
      httpOnly: true,
    });

    return this.authService.login(req.user);
  }
}
