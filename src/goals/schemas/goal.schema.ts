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

  @Prop({ required: true, enum: ['Fitness', 'Speaking', 'Interview'] })
  category: string; // e.g., "fitness", "career", "wellness"

  @Prop({ type: [String], index: true })
  tags: string[];

  // Timeline
  @Prop({ required: true })
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

  // Meeting
  @Prop({ required: true })
  meetingLink: string;

  @Prop({ required: true })
  meetingTime: string;

  // Status
  @Prop({
    required: true,
    enum: ['draft', 'posted', 'approved', 'completed', 'applications-closed'],
    index: true,
  })
  status: string;

  @Prop()
  adminComment?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

}

export const GoalSchema = SchemaFactory.createForClass(Goal);

// Create indexes
GoalSchema.index({ clientId: 1, createdAt: -1 });
GoalSchema.index({ status: 1, createdAt: -1 });
GoalSchema.index({ category: 1 });
GoalSchema.index({ startDate: 1 });
