import { HttpException, HttpStatus } from '@nestjs/common';

export class Ok extends HttpException {
  constructor() {
    super('User with this email already exist', HttpStatus.FORBIDDEN);
  }
}
