import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordService } from '../common/services/password.service';
import { GoalsModule } from '../goals/goals.module';
import { ApplicationsModule } from '../applications/applications.module';
// import { ApplicationsService } from '../applications/applications.service';
import { FeedbackModule } from '../feedback/feedback.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => GoalsModule),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => FeedbackModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
  exports: [UsersService, PasswordService],
})
export class UsersModule {}
