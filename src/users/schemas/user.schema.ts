import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

export type UserDocument = User & Document;

export enum UserRole {
  CLIENT = 'client',
  ASSISTANT = 'assistant',
  BOTH = 'both',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsNotEmpty()
  passwordHash: string;

  @Prop({ 
    required: true, 
    enum: UserRole,
    default: UserRole.CLIENT 
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Prop()
  avatarColor: string;

  @Prop()
  initials: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
