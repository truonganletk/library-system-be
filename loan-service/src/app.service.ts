import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';
import { Loan, LoanStatus } from './entities/loan.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
  ) {}

  async create(createLoanDto: CreateLoanDto): Promise<Loan> {
    try {
      const loan = this.loansRepository.create(createLoanDto);
      if (!loan.user_id || !loan.book_id || !loan.due_date) {
        throw new RpcException({
          message: 'Invalid loan data',
          status: 400,
        });
      }
      return this.loansRepository.save(loan);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: 500,
      });
    }
  }

  async returnBook(id: number, user_id: number): Promise<Loan> {
    const loan = await this.loansRepository.findOneBy({ id });
    if (!loan) {
      throw new RpcException({
        message: `Loan with ID ${id} not found.`,
        status: 404,
      });
    }
    if (loan.user_id !== user_id) {
      throw new RpcException({
        message: `Loan with ID ${id} does not belong to user ${user_id}.`,
        status: 400,
      });
    }

    if (loan.status !== LoanStatus.Borrowing) {
      throw new RpcException({
        message: `Loan with ID ${id} is not in Borrowing status.`,
        status: 400,
      });
    }

    loan.status = LoanStatus.Returning;
    return this.loansRepository.save(loan);
  }

  async findOverdueBooks(): Promise<Loan[]> {
    const overdueLoans = await this.loansRepository.find({
      where: {
        due_date: LessThan(new Date()),
        status: LoanStatus.Borrowing,
      },
    });
    return overdueLoans;
  }

  async findAll(): Promise<Loan[]> {
    return this.loansRepository.find();
  }

  async findLoansByStatus(status: LoanStatus): Promise<Loan[]> {
    return this.loansRepository.find({
      where: {
        status: status,
      },
    });
  }

  async acceptLoan(id: number): Promise<Loan> {
    const loan = await this.loansRepository.findOneBy({ id });
    if (!loan) {
      throw new RpcException({
        message: `Loan with ID ${id} not found.`,
        status: 404,
      });
    }

    if (loan.status === LoanStatus.Pending) {
      loan.status = LoanStatus.Borrowing;
    } else if (loan.status === LoanStatus.Returning) {
      loan.status = LoanStatus.Returned;
    } else {
      throw new RpcException({
        message: `Loan with ID ${id} is not in Pending or Returning status.`,
        status: 400,
      });
    }
    return this.loansRepository.save(loan);
  }
}
