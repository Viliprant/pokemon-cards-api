import { Controller, Request, Post, UseGuards, Res } from '@nestjs/common';
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
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const newRefreshToken = await this.authService.createRefreshToken(req.user);
    this.userService.updateRefreshToken(req.user.id, newRefreshToken);

    response.cookie('auth_cookie', newRefreshToken, {
      httpOnly: true,
    });

    return this.authService.CreateAccessToken(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('auth/refresh_token')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newRefreshToken = await this.authService.createRefreshToken(req.user);
    this.userService.updateRefreshToken(req.user.id, newRefreshToken);

    response.cookie('auth_cookie', newRefreshToken, {
      httpOnly: true,
    });

    return this.authService.CreateAccessToken(req.user);
  }
}
