import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateLoanDto } from './dto/create-loan.dto';
import { BooksService } from '../books/books.service';
import { BookStatus } from '../books/entities/book.entity';

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name);

  constructor(
    @Inject('LOAN_SERVICE') private readonly loanClient: ClientKafka,
    private readonly bookService: BooksService,
  ) {}

  private handleKafkaSend<T>(topic: string, payload: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.loanClient
        .send(topic, payload)
        .pipe(
          catchError((error) => {
            throw new HttpException(
              error.message || error.toString(),
              error.status || 500,
            );
          }),
        )
        .subscribe({
          next: (response) => {
            if (response) {
              resolve(response);
            } else {
              reject(
                new Error(
                  'Received null response, indicating an error in processing',
                ),
              );
            }
          },
          error: (err) => reject(err),
          complete: () =>
            this.logger.log(`Completed sending message to ${topic}`),
        });
    });
  }

  async create(createLoanDto: CreateLoanDto): Promise<any> {
    const book = await this.bookService.getBookById(createLoanDto.book_id);
    if (!book) {
      throw new HttpException('Book not found', 404);
    } else if (book.status !== 'available') {
      throw new HttpException('Book is not available', 400);
    }
    const loan = await this.handleKafkaSend('create-loan', { createLoanDto });
    await this.bookService.updateStatus(
      createLoanDto.book_id,
      BookStatus.CheckedOut,
    );

    return loan;
  }

  async returnBook(id: number, user_id: number): Promise<any> {
    return this.handleKafkaSend('return-book', {
      id,
      user_id,
    });
  }

  findOverdueBooks(): Promise<any> {
    return this.handleKafkaSend('find-overdue', {});
  }

  findAll(status: string): Promise<any> {
    return this.handleKafkaSend('find-all', { status });
  }

  async acceptLoan(id: number): Promise<any> {
    const loan: any = await this.handleKafkaSend('accept-loan', { id });
    if (!loan) {
      throw new HttpException('Loan not found', 404);
    }
    if (loan.status !== 'returned') return loan;
    await this.bookService.updateStatus(
      loan.book_id as number,
      BookStatus.Available,
    );

    return loan;
  }

  async onModuleInit() {
    await this.loanClient.subscribeToResponseOf('create-loan');
    await this.loanClient.subscribeToResponseOf('return-book');
    await this.loanClient.subscribeToResponseOf('find-overdue');
    await this.loanClient.subscribeToResponseOf('find-all');
    await this.loanClient.subscribeToResponseOf('accept-loan');
    await this.loanClient.connect();
  }
}
