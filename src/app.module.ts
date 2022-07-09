import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { PokemonGameModule } from './pokemon-game/pokemon-game.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMModuleOptions } from './TypeORMModuleOptions';

@Module({
  imports: [
    PokemonModule,
    PokemonGameModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(typeORMModuleOptions),
  ],
})
export class AppModule {}
