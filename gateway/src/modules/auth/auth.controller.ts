import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import { RegisterDto } from 'src/modules/user/dto/register.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  validateUser(@Request() req): any {
    return req.user;
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto): any {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto): any {
    return this.authService.register(registerDto);
  }
}
