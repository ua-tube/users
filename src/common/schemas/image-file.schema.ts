import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'

export type ImageFileDocument = ImageFile & Document

@Schema()
export class ImageFile {
  @Prop({ required: true })
  imageFileId: string;

  @Prop({ required: true })
  url: string;
}

export const ImageFileSchema = SchemaFactory.createForClass(ImageFile);
