import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinDate,
} from 'class-validator';

export class CreateLoanDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  book_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  @ApiProperty({ example: new Date() })
  due_date: Date;

  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  @ApiProperty({ example: new Date() })
  start_date: Date;
}
