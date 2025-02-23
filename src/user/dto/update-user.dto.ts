import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
  IsIn,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MaxLength(8, {
    message:
      'UserName is too long, Maximal length is $constraint1 characters, but actual is $value',
  })
  @MinLength(3, {
    message:
      'UserName is too short, Minimal length is $constraint1 characters, but actual is $value',
  })
  userName: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsIn(['online', 'offline'], {
    message: 'Status must be either "online" or "offline".',
  })
  status: string;

  @IsString()
  @Matches(/^[0-9]{11,13}$/, {
    message: 'Phone number must be between 11 to 13 digits.',
  })
  mobile: string;

  @IsBoolean()
  isDisabled: boolean;

  @IsBoolean()
  isDeleted: boolean;
}
