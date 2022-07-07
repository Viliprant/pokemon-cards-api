import { Expose } from 'class-transformer';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

export class Cards {
  pokemons: Pokemon[];

  constructor(pokemons: Pokemon[]) {
    this.pokemons = pokemons;
  }

  @Expose()
  get count() {
    const total: number = this.pokemons.reduce<number>(
      (prev: number, current: Pokemon): number => {
        return prev + current.quantity;
      },
      0,
    );
    return total;
  }
}
