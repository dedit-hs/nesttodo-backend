import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    this.authService.create(registerUserDto);
  }

  @Post('login')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
