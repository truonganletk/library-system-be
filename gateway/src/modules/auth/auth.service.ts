import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import { RegisterDto } from 'src/modules/user/dto/register.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) return null;

    const isMatch = bcrypt.compare(pass, user.password);
    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.username);
    if (!user) {
      throw new Error('User not found');
    }
    const payload = { username: loginDto.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const saltOrRounds = 10;
    registerDto.password = await bcrypt.hash(
      registerDto.password,
      saltOrRounds,
    );

    const user = await this.usersService.findOne(registerDto.username);
    if (user) {
      throw new BadRequestException('User already exists');
    } else {
      return this.usersService.create(registerDto);
    }
  }
}
