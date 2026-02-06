import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  ///////unused endpoints for now, but may be useful later////////

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get('goal/:goalId')
  findByGoalId(@Param('goalId') goalId: string) {
    return this.applicationsService.findByGoalId(goalId);
  }

  @Get('assistant/:assistantId')
  findByAssistantId(@Param('assistantId') assistantId: string) {
    return this.applicationsService.findByAssistantId(assistantId);
  }

  @Get('client/:clientId')
  findByClientId(@Param('clientId') clientId: string) {
    return this.applicationsService.findByClientId(clientId);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.applicationsService.findByStatus(status);
  }

  @Get('trial-status/:trialStatus')
  findByTrialStatus(@Param('trialStatus') trialStatus: string) {
    return this.applicationsService.findByTrialStatus(trialStatus);
  }

  @Get('goal/:goalId/active')
  findActiveApplications(@Param('goalId') goalId: string) {
    return this.applicationsService.findActiveApplications(goalId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.applicationsService.delete(id);
  }
}
