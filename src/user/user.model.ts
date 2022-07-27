import * as bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../roles-guard/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.Client,
  })
  role: string;

  @Prop()
  password: string;

  publicFields: () => UserDocument;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.publicFields = function () {
  const userObject: any = this.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const self: any = this;
    self.password = await bcrypt.hash(self.password, 8);
    return self;
  }
  next();
});
