import { Test, TestingModule } from '@nestjs/testing';
import { PokemonGameController } from './pokemon-game.controller';
import { PokemonGameService } from './pokemon-game.service';

describe('PokemonGameController', () => {
  let controller: PokemonGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonGameController],
      providers: [PokemonGameService],
    }).compile();

    controller = module.get<PokemonGameController>(PokemonGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
