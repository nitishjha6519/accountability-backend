import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  avatarColor?: string;

  @IsOptional()
  @IsString()
  initials?: string;

  @IsOptional()
  verified?: boolean;
}
