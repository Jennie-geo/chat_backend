import { Controller, Post, Body } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/sigup-auth.dto';

@Controller('users')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authsService.create(createAuthDto);
  }

  @Post('login')
  login() {
    return this.authsService.login();
  }

  @Post()
  logout() {
    return this.authsService.logout();
  }
}
