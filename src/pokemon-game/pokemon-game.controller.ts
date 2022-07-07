import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserCardsDto } from './dto/user-cards.dto';
import { Booster } from './entities/booster.entity';
import { PokemonGameService } from './pokemon-game.service';

@Controller('pokemon-game')
export class PokemonGameController {
  constructor(private readonly pokemonGameService: PokemonGameService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async openBooster(@Request() request): Promise<Booster> {
    const booster: Booster = await this.pokemonGameService.createBooster();
    this.pokemonGameService.addBoosterToUser(booster);
    return booster;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  async findUserCards(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<UserCardsDto> {
    return await this.pokemonGameService.findPokemonsByUserID(userID);
  }
}
