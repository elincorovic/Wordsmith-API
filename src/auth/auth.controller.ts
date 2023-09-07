import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: any) {
    console.log(dto);
    return this.authService.login();
  }

  @Post('signup')
  signup() {
    return this.authService.signup();
  }
}
