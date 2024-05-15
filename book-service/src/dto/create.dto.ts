import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { BookStatus } from 'src/entities/book.entity';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsEnum(BookStatus)
  status: BookStatus = BookStatus.Available;
}
