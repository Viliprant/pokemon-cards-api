import { Injectable } from '@nestjs/common';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { UserCardsDto } from './dto/user-cards.dto';
import { Booster } from './entities/booster.entity';

@Injectable()
export class PokemonGameService {
  mockDatabase = [
    {
      id: 1,
      name: 'Brandon',
      pokemons: [],
    },
    {
      id: 2,
      name: 'Sebastien',
      pokemons: [],
    },
    {
      id: 3,
      name: 'Bastien',
      pokemons: [],
    },
  ];

  constructor(private readonly pokemonService: PokemonService) {}

  async createBooster(): Promise<Booster> {
    const allRarities: string[] = await this.pokemonService.getRarities();

    const booster: Booster = new Booster();

    while (booster.pokemons.length < 5) {
      const randomNumber: number = Math.floor(
        Math.random() * allRarities.length - 1,
      ); //! PSEUDO AlEATOIRE
      const randomRarity: string = allRarities[randomNumber];

      const pokemon: Pokemon = await this.pokemonService.findRandomByRarity(
        randomRarity,
      );
      if (pokemon) {
        booster.add({ ...pokemon, quantity: 1 });
      }
    }

    // TODO INSERTION EN BASE DE DONNEES
    return booster;
  }

  addBoosterToUser(booster: Booster): void {
    // TODO Rendre dynamique avec le login (context)
    const loggedUsername = 'Brandon';

    const user = this.mockDatabase.find((user) => user.name === loggedUsername);
    const newPokemonList: Pokemon[] = this.createOrAddQuantity(
      booster,
      user.pokemons,
    );
    user.pokemons = newPokemonList;
  }

  async findPokemonsByUserID(userID: number): Promise<UserCardsDto> {
    const userCards: Pokemon[] = (
      await this.mockDatabase.find((user) => user.id === userID)
    ).pokemons;
    return new UserCardsDto(userCards);
  }

  createOrAddQuantity(booster: Booster, userPokemons: Pokemon[]): Pokemon[] {
    booster.pokemons.map((pokemonToAdd) => {
      if (pokemonToAdd) {
        const alreadyExist: Pokemon = userPokemons.find((pokemon) => {
          return pokemon.id === pokemonToAdd.id;
        });
        if (alreadyExist) {
          alreadyExist.quantity++;
        } else {
          userPokemons.push(pokemonToAdd);
        }
        return pokemonToAdd;
      }
    });

    return userPokemons;
  }
}
