import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoanStatus } from './entities/loan.entity';
import { ExceptionFilter } from './filters/rpc-exception.filter';

@Controller()
@UseFilters(new ExceptionFilter())
export class AppController {
  constructor(private readonly loansService: AppService) {}

  @MessagePattern('create-loan')
  async createLoan({ createLoanDto }: { createLoanDto: CreateLoanDto }) {
    const loan = await this.loansService.create(createLoanDto);
    return JSON.stringify(loan);
  }

  @MessagePattern('return-book')
  async returnBook({ id, user_id }: { id: number; user_id: number }) {
    const loan = await this.loansService.returnBook(id, user_id);
    return JSON.stringify(loan);
  }

  @MessagePattern('find-overdue')
  findOverdueBooks() {
    return this.loansService.findOverdueBooks();
  }

  @MessagePattern('find-all')
  findAll({ status }: { status: string }) {
    if (!Object.values(LoanStatus).includes(status as LoanStatus)) {
      return this.loansService.findAll();
    }
    return this.loansService.findLoansByStatus(status as LoanStatus);
  }

  @MessagePattern('accept-loan')
  async acceptLoan({ id }: { id: number }) {
    const loan = await this.loansService.acceptLoan(id);
    return JSON.stringify(loan);
  }

  @MessagePattern('get-loan-by-user')
  async getLoanByUserId({ id }: { id: number }) {
    return this.loansService.getLoanByUserId(id);
  }
}
