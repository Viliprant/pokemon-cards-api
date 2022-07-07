import { Exclude } from 'class-transformer';
import { Cards } from './cards.entity';

export class Collection {
  @Exclude()
  userID: string;

  cards: Cards;

  constructor(userID: string) {
    this.userID = userID;
    this.cards = new Cards([]);
  }
}
