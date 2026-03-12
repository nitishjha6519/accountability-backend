import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  avatarColor?: string;

  @IsOptional()
  @IsString()
  about?: string; // User profile about section

  @IsOptional()
  @IsString()
  initials?: string;
}
