import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_JWT'),
    });
  }

  async validate(payload: any) {
    // TODO: Verifier les IDs en BDD pour les tokens révoqués
    // TODO: REFRESH_TOKEN ...
    return { userId: payload.sub, username: payload.username };
  }
}
