import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RefreshTokenGuard } from 'src/auth/refresh_token.guard';
import { Booster } from './entities/booster.entity';
import { Collection } from './entities/collection.entity';
import { PokemonGameService } from './pokemon-game.service';

@Controller('pokemon-game')
export class PokemonGameController {
  constructor(private readonly pokemonGameService: PokemonGameService) {}

  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get('booster')
  async openBooster(@Request() request): Promise<Booster> {
    const collection: Collection =
      await this.pokemonGameService.findCollectionByUserID(request.user.id);

    if (!collection) {
      console.error("La collection n'existe pas.");
      throw new InternalServerErrorException();
    }

    const booster: Booster = await this.pokemonGameService.createBooster();
    this.pokemonGameService.addBoosterToUser(booster, request.user.id);
    return booster;
  }

  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('collection')
  async findUserCards(@Request() request): Promise<Collection> {
    return await this.pokemonGameService.findCollectionByUserID(
      request.user.id,
    );
  }
}
