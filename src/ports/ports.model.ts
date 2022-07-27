import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { User } from '../user/user.model';
import { Types } from 'mongoose';

export type PortDocument = Port & Document;

@Schema()
export class Port {
  @Prop()
  name: string;

  @Prop()
  location: string;
}

export const PortSchema = SchemaFactory.createForClass(Port);
