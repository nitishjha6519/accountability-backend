import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  // Relationships
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Goal' })
  goalId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  assistantId: Types.ObjectId;

  // Application info
  @Prop()
  pitch: string; // Assistant's pitch/motivation for this goal

  // Application status
  @Prop({
    required: true,
    // enum: ['pending', 'accepted', 'rejected'],
    // index: true,
  })
  status: string; // default is pending

  @Prop({
    required: true,
    enum: ['pending-start', 'active', 'completed', 'cancelled', 'none'],
    index: true,
  })
  trialStatus: string; // "pending-start", "active", "completed", "cancelled", "none"

  // Timestamps
  @Prop({ default: () => new Date(), index: true })
  createdAt: Date; // when application submitted

  @Prop({ default: () => new Date() })
  updatedAt: Date;

  @Prop()
  respondedAt?: Date; // when client accepted/rejected

  @Prop()
  startedAt?: Date; // when trial became "active"

  @Prop()
  completedAt?: Date; // when trial became "completed"
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Create indexes
ApplicationSchema.index({ goalId: 1, createdAt: -1 });
ApplicationSchema.index({ assistantId: 1, createdAt: -1 });
ApplicationSchema.index({ clientId: 1, createdAt: -1 });
ApplicationSchema.index({ status: 1, createdAt: -1 });
ApplicationSchema.index({ trialStatus: 1 });
