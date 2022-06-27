import { Test, TestingModule } from '@nestjs/testing';
import { PokemonGameService } from './pokemon-game.service';

describe('PokemonGameService', () => {
  let service: PokemonGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonGameService],
    }).compile();

    service = module.get<PokemonGameService>(PokemonGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
