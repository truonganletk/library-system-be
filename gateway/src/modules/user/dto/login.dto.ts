import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: '123456' })
  password: string;
}
