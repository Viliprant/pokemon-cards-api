import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  small: string;

  @Column()
  large: string;

  @OneToOne(() => Pokemon, (pokemon) => pokemon.images, { onDelete: 'CASCADE' })
  pokemon: Pokemon;
}
