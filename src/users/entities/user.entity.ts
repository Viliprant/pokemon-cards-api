import { UserPokemonLink } from 'src/pokemon/entities/user-pokemon.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  mail: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'DATETIME()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'DATETIME()',
    onUpdate: 'DATETIME()',
  })
  updatedAt: Date;

  @OneToMany(() => UserPokemonLink, (userPokemonLink) => userPokemonLink.user)
  userPokemonLink: UserPokemonLink[];
}
