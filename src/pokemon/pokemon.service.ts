import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { RaritiesResponseDto } from './dto/rarities-response.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Response } from './entities/response.entity';

@Injectable()
export class PokemonService {
  private connectionStringCards = 'https://api.pokemontcg.io/v2/cards';
  private connectionStringRarities = 'https://api.pokemontcg.io/v2/rarities';

  constructor(private readonly httpService: HttpService) {}

  async findOne(id: string) {
    const requestURL = `${this.connectionStringCards}/${id}?select=id,name,rarity,images`;
    console.log(`Request to ${requestURL}`);

    const response: AxiosResponse<Response> = await firstValueFrom(
      this.httpService.get(requestURL),
    );

    return response.data.data;
  }

  async getCount(rarity: string): Promise<number> {
    const requestCountTotal = `https://api.pokemontcg.io/v2/cards?pageSize=1&q=rarity:"${rarity}"&select=totalCount`;
    const countResponse: AxiosResponse<Response> = await firstValueFrom(
      this.httpService.get(requestCountTotal),
    );

    return countResponse.data.totalCount;
  }

  async findRandomByRarity(rarity: string): Promise<Pokemon> {
    const count: number = await this.getCount(rarity);

    const randomNumber = Math.floor(Math.random() * count) + 1; //! PSEUDO AlEATOIRE

    const requestURL = `${this.connectionStringCards}?pageSize=1&page=${randomNumber}&q=rarity:"${rarity}"&select=id,name,rarity,images`;
    console.log(`Request to ${requestURL}`);

    const response: AxiosResponse<Response> = await firstValueFrom(
      this.httpService.get(requestURL),
    );

    return response.data.data.shift();
  }

  async getRarities(): Promise<string[]> {
    const requestURL = `${this.connectionStringRarities}`;
    console.log(`Request to ${requestURL}`);

    const response: AxiosResponse<RaritiesResponseDto> = await firstValueFrom(
      this.httpService.get(requestURL),
    );

    const rarities: string[] = response.data.data;

    return rarities;
  }
}
