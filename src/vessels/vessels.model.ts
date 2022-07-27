import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export type VesselDocument = Vessel & Document;

@Schema()
export class Vessel {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, default: 'small' })
  size: string;
}

export const VesselSchema = SchemaFactory.createForClass(Vessel);
