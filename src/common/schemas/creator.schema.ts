import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { CreatorStatus } from '../enums';
import { ImageFile, ImageFileSchema } from './image-file.schema';

export type CreatorDocument = Creator & Document;

@Schema({ timestamps: true })
export class Creator {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop()
  description?: string;

  @Prop()
  email?: string;

  @Prop({ type: ImageFileSchema })
  @Type(() => ImageFile)
  thumbnail?: ImageFile;

  @Prop({ enum: CreatorStatus, default: CreatorStatus.Created })
  status: CreatorStatus;
}

export const CreatorSchema = SchemaFactory.createForClass(Creator);
