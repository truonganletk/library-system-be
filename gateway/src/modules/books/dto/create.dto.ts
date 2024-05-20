import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BookStatus } from '../entities/book.entity';
import { Transform } from 'class-transformer';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'The Great Gatsby' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  author: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Hobbit' })
  publisher?: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Year must be an integer' })
  @Min(1000)
  @Max(new Date().getFullYear())
  @ApiProperty({ example: '1925' })
  year: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Classic' })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Fantasy' })
  genre?: string;

  @IsOptional()
  @IsEnum(BookStatus)
  @ApiProperty({ example: 'available' })
  status: BookStatus = BookStatus.Available;
}
