import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './sigup-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
