import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const JWTOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const tokenSecret = configService.get<string>('ACCESS_TOKEN_SECRET');
    const expirationToken = configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    return {
      secret: tokenSecret,
      signOptions: { expiresIn: expirationToken },
    };
  },
  inject: [ConfigService],
};
