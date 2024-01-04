import { Body, Controller, Get, Post } from '@nestjs/common';
import { md5 } from 'src/utils';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
  @Get('test')
  async test() {
    return md5('123');
  }
}
