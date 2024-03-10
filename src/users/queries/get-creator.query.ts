import { CanBeNull, CanBeUndefined } from '../../common/decorators';

export class GetCreatorQuery {
  @CanBeUndefined()
  @CanBeNull()
  userId?: string;

  @CanBeUndefined()
  @CanBeNull()
  nickname?: string;
}
