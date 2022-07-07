import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { v4 as uuid } from 'uuid';

export class Booster {
  id: string;
  pokemons: Pokemon[] = [];

  add(pokemon: Pokemon) {
    this.id = uuid();
    this.pokemons.push(pokemon);
  }
}
