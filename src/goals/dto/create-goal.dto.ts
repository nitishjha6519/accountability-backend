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
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  motivation?: string;

  @IsOptional()
  @IsString()
  category?: string;

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

  @IsString()
  status: string; // "draft" | "posted" | "matched" | "completed" | "paused"
}
