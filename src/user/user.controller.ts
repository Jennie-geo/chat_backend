import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import Joi from 'joi';

@Controller('users')
export class UsersController {
  // private authsService: AuthsService;
  constructor(private readonly authsService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authsService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.authsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authsService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authsService.remove(+id);
  }
}
