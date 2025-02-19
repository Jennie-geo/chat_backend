import { Controller, Post, Body } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/sigup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('users')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authsService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authsService.login(loginAuthDto);
  }

  @Post()
  logout() {
    return this.authsService.logout();
  }
}
