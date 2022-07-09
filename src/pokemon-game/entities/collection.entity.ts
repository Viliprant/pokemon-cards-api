import { Expose } from 'class-transformer';
import { PokemonCard } from './pokemonCard.entity';

export class Collection {
  pokemons: PokemonCard[];
  @Expose()
  get count() {
    const total: number = this.pokemons.reduce<number>(
      (prev: number, current: PokemonCard): number => {
        return prev + current.quantity;
      },
      0,
    );
    return total;
  }

  constructor(pokemons: PokemonCard[]) {
    this.pokemons = pokemons;
  }
}
