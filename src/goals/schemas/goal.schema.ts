import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema({ timestamps: true })
export class Goal {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  clientId: Types.ObjectId;

  // Basic info
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  motivation: string;

  @Prop()
  category: string; // e.g., "fitness", "career", "wellness"

  @Prop({ type: [String], index: true })
  tags: string[];

  // Timeline
  @Prop({ required: true, index: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  dailyEffort: string; // e.g., "30 mins", "1 hour"

  @Prop()
  checkInFrequency: string; // e.g., "daily", "3x/week", "weekly"

  // Financial
  @Prop({ default: false })
  hasPledge: boolean;

  @Prop()
  pledgeAmount: number; // amount at stake (optional)

  @Prop()
  rewardAmount: number; // payment for assistant

  @Prop()
  rewardPeriod: string; // e.g., "per session", "per week", "per month"

  // Status
  @Prop({
    required: true,
    enum: ['draft', 'posted', 'matched', 'completed', 'paused'],
    index: true,
  })
  status: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);

// Create indexes
GoalSchema.index({ clientId: 1, createdAt: -1 });
GoalSchema.index({ status: 1, createdAt: -1 });
GoalSchema.index({ category: 1 });
GoalSchema.index({ startDate: 1 });
