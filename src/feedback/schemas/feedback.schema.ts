import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  // Relationships
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'Application',
    index: true,
  })
  applicationId: Types.ObjectId;

  // Who gave/received feedback
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  providedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  receivedBy: Types.ObjectId;

  // Session date
  @Prop({ required: true, index: true })
  sessionDate: string; // format: "YYYY-MM-DD"

  // Attendance confirmation
  @Prop({ required: true })
  clientPresent: boolean;

  @Prop({ required: true })
  assistantPresent: boolean;

  // Rating
  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  stars: number; // 1-5 rating

  // Written feedback
  @Prop()
  comment?: string; // optional, text feedback/notes

  @Prop({ default: () => new Date(), index: true })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

// Create indexes
FeedbackSchema.index({ applicationId: 1, createdAt: -1 });
FeedbackSchema.index({ applicationId: 1, sessionDate: -1 });
FeedbackSchema.index({ providedBy: 1, createdAt: -1 });
FeedbackSchema.index({ receivedBy: 1, createdAt: -1 });
FeedbackSchema.index({ sessionDate: 1 });
