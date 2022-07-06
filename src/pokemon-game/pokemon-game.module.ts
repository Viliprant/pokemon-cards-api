import { Module } from '@nestjs/common';
import { PokemonGameService } from './pokemon-game.service';
import { PokemonGameController } from './pokemon-game.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Module({
  imports: [PokemonModule, AuthModule],
  controllers: [PokemonGameController],
  providers: [PokemonGameService, JwtAuthGuard, LocalAuthGuard],
})
export class PokemonGameModule {}
