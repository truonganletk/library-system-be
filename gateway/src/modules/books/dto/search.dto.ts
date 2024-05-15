import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchBooksDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'string' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'string' })
  author?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'string' })
  genre?: string;
}
