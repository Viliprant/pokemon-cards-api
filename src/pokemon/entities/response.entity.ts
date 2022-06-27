import { Pokemon } from './pokemon.entity';

export class Response {
  data: Pokemon[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}
