import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Booster } from './entities/booster.entity';
import { Cards } from './entities/cards.entity';
import { Collection } from './entities/collection.entity';
import * as lodash from 'lodash';
import { User } from 'src/users/entities/user.entity';
import { OnEvent } from '@nestjs/event-emitter';

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
    const updatedCards = lodash.cloneDeep(cards);

    booster.pokemons.map((pokemonToAdd) => {
      if (pokemonToAdd) {
        const alreadyExist: Pokemon = updatedCards.pokemons.find((pokemon) => {
          return pokemon.id === pokemonToAdd.id;
        });
        if (alreadyExist) {
          alreadyExist.quantity++;
        } else {
          updatedCards.pokemons.push(pokemonToAdd);
        }
        return pokemonToAdd;
      }
    });

    return updatedCards;
  }

  createCollection(userID: string) {
    this.collections.push(new Collection(userID));
  }

  @OnEvent('user.created')
  handleOrderCreatedEvent(newUser: User) {
    this.createCollection(newUser.id);
  }
}
