import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from '../auth.service';

@Controller()
export class RegistrationController {
  constructor(private authService: AuthService) {}

  @Post('auth/registration')
  async login(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
