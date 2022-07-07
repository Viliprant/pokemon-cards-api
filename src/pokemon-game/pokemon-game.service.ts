import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Booster } from './entities/booster.entity';
import { Cards } from './entities/cards.entity';
import { Collection } from './entities/collection.entity';

@Injectable()
export class PokemonGameService {
  collections: Collection[] = [];

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

    booster.add({
      id: 'cel25c-15_A2',
      name: 'Here Comes Team Rocket!',
      rarity: 'Classic Collection',
      images: {
        small: 'https://images.pokemontcg.io/cel25c/15_B.png',
        large: 'https://images.pokemontcg.io/cel25c/15_B_hires.png',
      },
      quantity: 1,
    });

    // TODO INSERTION EN BASE DE DONNEES
    return booster;
  }

  addBoosterToUser(booster: Booster, userID: string): void {
    const collection = this.collections.find(
      (collection) => collection.userID === userID,
    );

    if (!collection) {
      console.error("La collection n'existe pas.");
      throw new InternalServerErrorException();
    }

    const newCards: Cards = this.createOrAddQuantity(booster, collection.cards);
    collection.cards = newCards;
  }

  async findCollectionByUserID(userID: string): Promise<Collection> {
    const collection: Collection = await this.collections.find(
      (collection) => collection.userID === userID,
    );

    if (!collection) {
      console.error("La collection n'existe pas.");
      throw new InternalServerErrorException();
    }

    return collection;
  }

  createOrAddQuantity(booster: Booster, cards: Cards): Cards {
    // TODO: Make Pure function
    booster.pokemons.map((pokemonToAdd) => {
      if (pokemonToAdd) {
        const alreadyExist: Pokemon = cards.pokemons.find((pokemon) => {
          return pokemon.id === pokemonToAdd.id;
        });
        if (alreadyExist) {
          alreadyExist.quantity++;
        } else {
          cards.pokemons.push(pokemonToAdd);
        }
        return pokemonToAdd;
      }
    });

    return cards;
  }

  createCollection(userID: string) {
    this.collections.push(new Collection(userID));
  }
}
