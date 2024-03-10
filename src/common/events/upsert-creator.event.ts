import { CreatorDocument } from '../schemas';

export class UpsertCreatorEvent {
  id: string;
  displayName: string;
  nickname: string;

  constructor(creator: CreatorDocument) {
    this.id = creator.userId;
    this.displayName = creator.displayName;
    this.nickname = creator.nickname;
  }
}
