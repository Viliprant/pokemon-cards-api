import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Image } from './image.entity';
import { UserPokemonLink } from './user-pokemon.entity';

@Entity()
export class Pokemon {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  rarity: string;

  @OneToOne(() => Image, (image) => image.pokemon, {
    eager: true,
    cascade: true,
  }) // keep it as default
  @JoinColumn()
  images: Image;

  @OneToMany(
    () => UserPokemonLink,
    (userPokemonLink) => userPokemonLink.pokemon,
  )
  userPokemonLink: UserPokemonLink[];
}
