import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { PokemonGameModule } from './pokemon-game/pokemon-game.module';

@Module({
  imports: [PokemonModule, PokemonGameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
