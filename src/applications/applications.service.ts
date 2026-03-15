import {
  Injectable,
  Inject,
  forwardRef,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const goal = await this.goalModel
      .findById(createApplicationDto.goalId)
      .exec();

    if (!goal) {
      throw new NotFoundException('Goal not found.');
    }

    if (goal.status === 'applications-closed') {
      throw new BadRequestException('Applications are closed for this goal.');
    }

    // Check if assistant already applied to this goal
    const existingApplication = await this.applicationModel
      .findOne({
        goalId: createApplicationDto.goalId,
        assistantId: createApplicationDto.assistantId,
      })
      .exec();

    if (existingApplication) {
      throw new ConflictException('You have already applied to this goal.');
    }

    const applicationCount = await this.applicationModel
      .countDocuments({ goalId: createApplicationDto.goalId })
      .exec();

    if (applicationCount >= 3) {
      await this.goalModel.findByIdAndUpdate(createApplicationDto.goalId, {
        status: 'applications-closed',
      });
      throw new BadRequestException('Applications are closed for this goal.');
    }

    const createdApplication = new this.applicationModel(createApplicationDto);
    const savedApplication = await createdApplication.save();

    if (applicationCount + 1 >= 3) {
      await this.goalModel.findByIdAndUpdate(createApplicationDto.goalId, {
        status: 'applications-closed',
      });
    }

    return savedApplication;
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
      .populate({ path: 'assistantId', model: 'User' })
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

    // // Set startedAt when trial becomes active
    // if (updateApplicationDto.trialStatus === 'active') {
    //   updateData.startedAt = new Date();
    // }

    // // Set completedAt when trial is completed and transfer points to assistant
    // if (updateApplicationDto.trialStatus === 'completed') {
    //   updateData.completedAt = new Date();

    //   // Get the application to find assistantId and goalId
    //   const application = await this.applicationModel.findById(id).exec();
    //   if (application) {
    //     // Get the goal to find rewardAmount
    //     const goal = await this.goalModel.findById(application.goalId).exec();
    //     if (goal && goal.rewardAmount) {
    //       // Transfer points to assistant
    //       await this.usersService.addPoints(
    //         application.assistantId.toString(),
    //         goal.rewardAmount,
    //       );
    //       console.log(
    //         `[Points] Transferred ${goal.rewardAmount} points to assistant ${application.assistantId} for completing goal ${goal._id}`,
    //       );
    //     }
    //   }
    // }

    return this.applicationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.applicationModel.findByIdAndDelete(id).exec();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTrialStatusUpdates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find accepted applications with trialStatus 'pending-start' where goal startDate is today
    const appsToActivate = await this.applicationModel
      .find({ status: 'accepted', trialStatus: 'none' })
      .populate('goalId')
      .exec();

    for (const app of appsToActivate) {
      const goal = app.goalId as any;
      if (goal && goal.startDate) {
        const startDate = new Date(goal.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (startDate.getTime() <= today.getTime()) {
          await this.applicationModel.findByIdAndUpdate(app._id, {
            trialStatus: 'active',
            startedAt: new Date(),
          });
          console.log(`[Cron] Activated trial for application ${app._id}`);
        }
      }
    }

    // Find active applications where goal endDate has passed
    const appsToComplete = await this.applicationModel
      .find({ status: 'accepted', trialStatus: 'active' })
      .populate('goalId')
      .exec();

    for (const app of appsToComplete) {
      const goal = app.goalId as any;
      if (goal && goal.endDate) {
        const endDate = new Date(goal.endDate);
        endDate.setHours(0, 0, 0, 0);
        if (endDate.getTime() < today.getTime()) {
          await this.applicationModel.findByIdAndUpdate(app._id, {
            trialStatus: 'completed',
            completedAt: new Date(),
          });

          // Transfer reward points to assistant
          if (goal.rewardAmount) {
            await this.usersService.addPoints(
              app.assistantId.toString(),
              goal.rewardAmount,
            );
            console.log(
              `[Cron] Transferred ${goal.rewardAmount} points to assistant ${app.assistantId} for completing goal ${goal._id}`,
            );
          }

          console.log(`[Cron] Completed trial for application ${app._id}`);
        }
      }
    }
  }
}
