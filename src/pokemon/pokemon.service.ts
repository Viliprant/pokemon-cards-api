import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from './entities/pokemon.entity';
import { Response } from './entities/response.entity';

@Injectable()
export class PokemonService {
  connectionString = 'https://api.pokemontcg.io/v2/cards';

  constructor(private readonly httpService: HttpService) {}

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  async findRandomByRarity(rarity: string): Promise<Pokemon[]> {
    const requestCountTotal = `https://api.pokemontcg.io/v2/cards?pageSize=1&q=rarity:"${rarity}"&select=totalCount`;
    const responseCount: AxiosResponse<Response> = await firstValueFrom(
      this.httpService.get(requestCountTotal),
    );
    const randomNumber =
      Math.floor(Math.random() * responseCount.data.totalCount - 1) + 1;

    const requestURL = `${this.connectionString}?pageSize=1&page=${randomNumber}&q=rarity:"${rarity}"&select=id,name,rarity,images`;
    console.log(`Request to ${requestURL}`);

    const response: AxiosResponse<Response> = await firstValueFrom(
      this.httpService.get(requestURL),
    );

    return response.data.data;
  }
}
