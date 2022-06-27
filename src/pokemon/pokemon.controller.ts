import { Controller, Get, Param, Query } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('/random')
  async findRandomByRarity(@Query('rarity') rarity: string): Promise<Pokemon> {
    return this.pokemonService.findRandomByRarity(rarity);
  }

  @Get('/rarities')
  async findRarities(): Promise<string[]> {
    return this.pokemonService.getRarities();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }
}
