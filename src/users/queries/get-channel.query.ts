import { CanBeNull, CanBeUndefined } from '../../common/decorators';

export class GetChannelQuery {
  @CanBeUndefined()
  @CanBeNull()
  userId?: string;

  @CanBeUndefined()
  @CanBeNull()
  nickname?: string;
}
