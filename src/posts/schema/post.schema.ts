import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  body: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  mediaUrl: string;

  @Prop({ enum: ['image', 'video', null], default: null })
  mediaType: string;

  @Prop({ default: 0 })
  likesCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
