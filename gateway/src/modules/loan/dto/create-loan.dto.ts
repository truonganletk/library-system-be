import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  book_id: number;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: new Date() })
  due_date: Date;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: new Date() })
  start_date: Date;
}
