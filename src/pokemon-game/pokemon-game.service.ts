import { Injectable } from '@nestjs/common';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Booster } from './entities/booster.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPokemonLink } from 'src/pokemon/entities/user-pokemon.entity';
import { User } from 'src/users/entities/user.entity';
import { Image } from 'src/pokemon/entities/image.entity';
import { UsersService } from 'src/users/users.service';
import { PokemonCard } from './entities/pokemonCard.entity';
import { PokemonWithQuantityDto } from './dto/pokemon-quantity.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class PokemonGameService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly userService: UsersService,
    @InjectRepository(Pokemon) private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,

    @InjectRepository(UserPokemonLink)
    private userPokemonLinkRepository: Repository<UserPokemonLink>,
  ) {}

  async createBooster(): Promise<Booster> {
    // TODO: Mettre toutes les raretés dans la BDD
    const allRarities: string[] = await this.pokemonService.getRarities();

    const booster: Booster = new Booster();

    while (booster.pokemons.length < 5) {
      const randomNumber: number = Math.floor(
        Math.random() * allRarities.length - 1,
      ); //! PSEUDO AlEATOIRE
      const randomRarity: string = allRarities[randomNumber];

      const randomPokemon: Pokemon =
        await this.pokemonService.findRandomByRarity(randomRarity);

      if (randomPokemon) {
        const alreadyInDB = await this.pokemonRepository.findOneBy(
          randomPokemon,
        );
        if (!alreadyInDB) {
          const pokemon = this.pokemonRepository.create(randomPokemon);
          const newPokemon = await this.pokemonRepository.save(pokemon);
          booster.add(newPokemon);
        } else {
          booster.add(alreadyInDB);
        }
      }
    }

    return booster;
  }

  addBoosterToUser(booster: Booster, userID: number): void {
    this.mergeBoosterWithUserCollection(booster, userID);
  }

  async mergeBoosterWithUserCollection(booster: Booster, userID: number) {
    const user: User = await this.userService.findOneByID(userID);
    for (const pokemonToAdd of booster.pokemons) {
      if (pokemonToAdd) {
        const existingUserPokemonLink: UserPokemonLink =
          await this.userPokemonLinkRepository.findOneBy({
            userId: user.id,
            pokemonId: pokemonToAdd.id,
          });

        if (existingUserPokemonLink) {
          existingUserPokemonLink.quantity++;

          await this.userPokemonLinkRepository.save(existingUserPokemonLink);
        } else {
          const UserPokemonLink: UserPokemonLink =
            this.userPokemonLinkRepository.create({
              user,
              pokemon: pokemonToAdd,
            });
          await this.userPokemonLinkRepository.save(UserPokemonLink);
        }
      }
    }
  }

  async getCollectionCardsByUserID(userID: number): Promise<Collection> {
    const pokemons: PokemonWithQuantityDto[] =
      await this.userPokemonLinkRepository.query(
        `
      SELECT p.id, name, rarity, small, large, quantity
      FROM USER_POKEMON_LINK upl
      LEFT JOIN USER u ON upl.userid = u.id
      LEFT JOIN POKEMON p ON upl.pokemonid = p.id
      LEFT JOIN IMAGE i ON p.imagesid = i.id
      WHERE u.id == ?
    `,
        [userID],
      );

    const pokemonCards: PokemonCard[] = pokemons.map((pokemonDto) => {
      return {
        pokemon: {
          id: pokemonDto.id,
          name: pokemonDto.name,
          rarity: pokemonDto.rarity,
          images: {
            small: pokemonDto.small,
            large: pokemonDto.large,
          },
        },
        quantity: pokemonDto.quantity,
      };
    }) as PokemonCard[];

    return new Collection(pokemonCards);
  }
}
