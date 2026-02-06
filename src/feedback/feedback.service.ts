import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import {
  Application,
  ApplicationDocument,
} from '../applications/schemas/application.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    // Check if application exists and is accepted
    const application = await this.applicationModel.findById(
      createFeedbackDto.applicationId,
    );

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== 'accepted') {
      throw new BadRequestException(
        'Can only submit feedback for accepted applications',
      );
    }

    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    return createdFeedback.save();
  }

  async findAll() {
    return this.feedbackModel.find().exec();
  }

  async findByApplicationId(applicationId: string) {
    return this.feedbackModel
      .find({ applicationId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByProvidedBy(providedBy: string) {
    return this.feedbackModel
      .find({ providedBy })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByReceivedBy(receivedBy: string) {
    return this.feedbackModel
      .find({ receivedBy })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    return this.feedbackModel.findById(id).exec();
  }

  async findBySessionDate(sessionDate: string) {
    return this.feedbackModel
      .find({ sessionDate })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByApplicationAndDateRange(
    applicationId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.feedbackModel
      .find({
        applicationId,
        sessionDate: { $gte: startDate, $lte: endDate },
      })
      .sort({ sessionDate: -1 })
      .exec();
  }

  async getAverageRatingByRecipient(receivedBy: string) {
    const result = await this.feedbackModel
      .aggregate([
        { $match: { receivedBy: receivedBy } },
        { $group: { _id: null, averageRating: { $avg: '$stars' } } },
      ])
      .exec();

    return result.length > 0 ? result[0].averageRating : 0;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackModel
      .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.feedbackModel.findByIdAndDelete(id).exec();
  }
}
