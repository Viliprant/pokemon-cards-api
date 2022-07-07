import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RefreshTokenService {
  refreshTokenSecret: string;
  refreshTokenExpiration: string;

  constructor(private configService: ConfigService) {
    this.refreshTokenSecret = configService.get<string>('REFRESH_TOKEN_SECRET');
    this.refreshTokenExpiration = configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }
  async sign(payload): Promise<any> {
    const token = await jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiration,
    });

    return token;
  }

  async verify(token): Promise<any> {
    return await jwt.verify(token, this.refreshTokenSecret, {
      ignoreExpiration: false,
    });
  }
}
