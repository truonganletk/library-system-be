import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  book_id: number;

  @IsNotEmpty()
  @IsDate()
  due_date: Date;

  @IsNotEmpty()
  @IsDate()
  start_date: Date;
}
