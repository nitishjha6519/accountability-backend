import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoalDto {
  @IsString()
  clientId: string; // User ID of the client posting the goal

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  motivation?: string;

  @IsString()
  category: 'Fitness' | 'Speaking' | 'Interview'; // required

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  dailyEffort?: string;

  @IsOptional()
  @IsString()
  checkInFrequency?: string;

  @IsOptional()
  @IsBoolean()
  hasPledge?: boolean;

  @IsOptional()
  @IsNumber()
  pledgeAmount?: number;

  @IsOptional()
  @IsNumber()
  rewardAmount?: number;

  @IsOptional()
  @IsString()
  rewardPeriod?: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  meetingTime?: string;

  @IsString()
  status: string; // "draft" | "posted" | "matched" | "completed" | "paused" | "applications-closed"
}
