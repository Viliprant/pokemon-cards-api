import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { v4 as uuidv4 } from 'uuid';

export class Booster {
  id: string;
  pokemons: Pokemon[] = [];

  add(pokemon: Pokemon) {
    this.id = uuidv4();
    this.pokemons.push(pokemon);
  }
}
