import { IsNotEmpty, IsString } from 'class-validator';
import { CanBeNull, CanBeUndefined } from '../../common/decorators';

export class UpsertCreatorDto {
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @CanBeUndefined()
  @CanBeNull()
  @IsString()
  thumbnailToken?: string;
}
