import { IsIn, IsString, Length } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @IsIn(['chat', 'group'], {
    message:
      'Type must either contain $constraint1 fields, but actual is $value',
  })
  type: string;
}
