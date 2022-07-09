import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { HttpModule } from '@nestjs/axios';
import { Pokemon } from './entities/pokemon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { UserPokemonLink } from './entities/user-pokemon.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Pokemon, Image, UserPokemonLink]),
  ],
  providers: [PokemonService],
  exports: [PokemonService, TypeOrmModule],
})
export class PokemonModule {}
