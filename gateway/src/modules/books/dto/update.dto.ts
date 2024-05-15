import { IsString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { BookStatus } from '../entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'The Great Gatsby' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  author?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Hobbit' })
  publisher?: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  @ApiProperty({ example: '1925' })
  year?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Fantasy' })
  genre?: string;

  @IsOptional()
  @IsEnum(BookStatus)
  @ApiProperty({ example: 'available' })
  status?: BookStatus;
}
