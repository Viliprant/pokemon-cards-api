import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { LoginController } from './login/login.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RegistrationController } from './registration/registration.controller';
import { RefreshTokenGuard } from './refresh_token.guard';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
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
    }),
  ],
  controllers: [LoginController, RegistrationController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenService,
    RefreshTokenGuard,
    JwtAuthGuard,
    UsersService,
  ],
  exports: [
    JwtAuthGuard,
    RefreshTokenGuard,
    RefreshTokenService,
    UsersService,
    AuthService,
  ],
})
export class AuthModule {}
