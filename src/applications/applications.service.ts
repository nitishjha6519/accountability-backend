import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UsersService } from '../users/users.service';
import { Goal, GoalDocument } from '../goals/schemas/goal.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Goal.name)
    private goalModel: Model<GoalDocument>,
    private usersService: UsersService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const createdApplication = new this.applicationModel(createApplicationDto);
    return createdApplication.save();
  }

  async findAll() {
    return this.applicationModel.find().exec();
  }

  async findByGoalId(goalId: string) {
    return this.applicationModel
      .find({ goalId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByAssistantId(assistantId: string) {
    return this.applicationModel
      .find({ assistantId })
      .populate('goalId')
      .populate({ path: 'clientId', model: 'User' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByClientId(clientId: string) {
    return this.applicationModel
      .find({ clientId })
      .populate({ path: 'clientId', model: 'User' })
      .populate('goalId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    return this.applicationModel
      .findById(id)
      .populate({ path: 'clientId', model: 'User' })
      .populate({ path: 'assistantId', model: 'User' })
      .populate('goalId')
      .exec();
  }

  async findByStatus(status: string) {
    return this.applicationModel
      .find({ status })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByTrialStatus(trialStatus: string) {
    return this.applicationModel
      .find({ trialStatus })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActiveApplications(goalId: string) {
    return this.applicationModel
      .find({ goalId, status: 'accepted', trialStatus: 'active' })
      .exec();
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    const updateData: any = { ...updateApplicationDto };

    // Set respondedAt when status changes to accepted/rejected
    if (
      updateApplicationDto.status === 'accepted' ||
      updateApplicationDto.status === 'rejected'
    ) {
      updateData.respondedAt = new Date();
    }

    // Set startedAt when trial becomes active
    if (updateApplicationDto.trialStatus === 'active') {
      updateData.startedAt = new Date();
    }

    // Set completedAt when trial is completed and transfer points to assistant
    if (updateApplicationDto.trialStatus === 'completed') {
      updateData.completedAt = new Date();

      // Get the application to find assistantId and goalId
      const application = await this.applicationModel.findById(id).exec();
      if (application) {
        // Get the goal to find rewardAmount
        const goal = await this.goalModel.findById(application.goalId).exec();
        if (goal && goal.rewardAmount) {
          // Transfer points to assistant
          await this.usersService.addPoints(
            application.assistantId.toString(),
            goal.rewardAmount,
          );
          console.log(`[Points] Transferred ${goal.rewardAmount} points to assistant ${application.assistantId} for completing goal ${goal._id}`);
        }
      }
    }

    return this.applicationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.applicationModel.findByIdAndDelete(id).exec();
  }
}
