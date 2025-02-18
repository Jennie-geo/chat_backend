import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
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
