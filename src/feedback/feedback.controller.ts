import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get('application/:applicationId')
  findByApplicationId(@Param('applicationId') applicationId: string) {
    return this.feedbackService.findByApplicationId(applicationId);
  }

  ////////////unused endpoints for now, but may be useful later////////////////

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get('provided-by/:providedBy')
  findByProvidedBy(@Param('providedBy') providedBy: string) {
    return this.feedbackService.findByProvidedBy(providedBy);
  }

  @Get('received-by/:receivedBy')
  findByReceivedBy(@Param('receivedBy') receivedBy: string) {
    return this.feedbackService.findByReceivedBy(receivedBy);
  }

  @Get('rating/:receivedBy')
  getAverageRating(@Param('receivedBy') receivedBy: string) {
    return this.feedbackService.getAverageRatingByRecipient(receivedBy);
  }

  @Get('session-date/:sessionDate')
  findBySessionDate(@Param('sessionDate') sessionDate: string) {
    return this.feedbackService.findBySessionDate(sessionDate);
  }

  @Get('application/:applicationId/range')
  findByDateRange(
    @Param('applicationId') applicationId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.feedbackService.findByApplicationAndDateRange(
      applicationId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.feedbackService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.feedbackService.delete(id);
  }
}
