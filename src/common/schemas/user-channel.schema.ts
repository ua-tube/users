import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { ImageFile } from './image-file.schema';

export type UserChannelDocument = UserChannel & Document;

@Schema()
export class UserChannel {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ type: ImageFile })
  @Type(() => ImageFile)
  banner?: ImageFile;
}

export const UserChannelSchema = SchemaFactory.createForClass(UserChannel);
