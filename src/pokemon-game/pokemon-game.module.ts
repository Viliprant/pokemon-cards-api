import { Module } from '@nestjs/common';
import { PokemonGameService } from './pokemon-game.service';
import { PokemonGameController } from './pokemon-game.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { RefreshTokenGuard } from 'src/auth/refresh_token.guard';

@Module({
  imports: [PokemonModule, AuthModule],
  controllers: [PokemonGameController],
  providers: [PokemonGameService, JwtAuthGuard, RefreshTokenGuard],
  exports: [PokemonGameService],
})
export class PokemonGameModule {}
