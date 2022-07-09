import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity()
export class UserPokemonLink {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userPokemonLink)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.userPokemonLink, {
    onDelete: 'SET NULL',
  })
  pokemon: Pokemon;

  @Column()
  pokemonId: string;

  @Column({ default: 1 })
  quantity: number;
}
