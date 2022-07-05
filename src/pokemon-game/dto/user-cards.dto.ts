import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

export class UserCardsDto {
  pokemons: Pokemon[];
  count: number;

  constructor(pokemons: Pokemon[]) {
    this.pokemons = pokemons;
    this.count = pokemons.length;
  }
}
