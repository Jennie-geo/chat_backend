import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  type: string;

  @IsString()
  groupId: string;

  @IsString()
  sender: string;

  @IsString()
  recipient: string;

  @IsNotEmpty()
  @IsString()
  uniqueId: string;

  @IsString()
  isDeleted: boolean;

  @IsBoolean()
  isRead: boolean;

  @IsObject()
  meta: object;
}
