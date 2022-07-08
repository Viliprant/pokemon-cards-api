import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { PokemonGameModule } from './pokemon-game/pokemon-game.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    PokemonModule,
    PokemonGameModule,
    AuthModule,
    UsersModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
