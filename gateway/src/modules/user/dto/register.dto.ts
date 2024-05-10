// src/auth/dto/register.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'user' })
  role: string;
}
