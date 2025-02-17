import { IsBoolean, IsDate, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  avatar: string;

  @IsString()
  status: string;

  @IsString()
  mobile: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isDisabled: boolean;

  @IsBoolean()
  isDeleted: boolean;

  @IsDate()
  lastLogin: Date;
}
