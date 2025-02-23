import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/sigup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
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
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Request() req: Request) {
    return this.authsService.logout(req);
  }
}
