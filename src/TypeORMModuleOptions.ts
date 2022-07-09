import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Image } from './pokemon/entities/image.entity';
import { Pokemon } from './pokemon/entities/pokemon.entity';
import { UserPokemonLink } from './pokemon/entities/user-pokemon.entity';
import { User } from './users/entities/user.entity';

export const typeORMModuleOptions: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db',
  entities: [User, Pokemon, Image, UserPokemonLink],
  synchronize: true,
};
