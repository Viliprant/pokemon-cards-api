import { Module } from '@nestjs/common';
import { PokemonGameService } from './pokemon-game.service';
import { PokemonGameController } from './pokemon-game.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [PokemonModule],
  controllers: [PokemonGameController],
  providers: [PokemonGameService],
})
export class PokemonGameModule {}
