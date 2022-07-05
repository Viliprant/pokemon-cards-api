import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { UserCardsDto } from './dto/user-cards.dto';
import { Booster } from './entities/booster.entity';
import { PokemonGameService } from './pokemon-game.service';

@Controller('pokemon-game')
export class PokemonGameController {
  constructor(private readonly pokemonGameService: PokemonGameService) {}

  @Get()
  async openBooster(): Promise<Booster> {
    const booster: Booster = await this.pokemonGameService.createBooster();
    this.pokemonGameService.addBoosterToUser(booster);
    return booster;
  }

  @Get('/user/:id')
  async findUserCards(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<UserCardsDto> {
    return await this.pokemonGameService.findPokemonsByUserID(userID);
  }
}
