import { Module } from '@nestjs/common';
import { PokemonGameService } from './pokemon-game.service';
import { PokemonGameController } from './pokemon-game.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { RefreshTokenGuard } from 'src/auth/refresh_token.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PokemonModule, AuthModule, UsersModule],
  controllers: [PokemonGameController],
  providers: [PokemonGameService, JwtAuthGuard, RefreshTokenGuard],
  exports: [PokemonGameService],
})
export class PokemonGameModule {}
