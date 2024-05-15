import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateBookDto } from './dto/create.dto';
import { UpdateBookDto } from './dto/update.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  constructor(
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientKafka,
  ) {}

  private handleKafkaSend<T>(topic: string, payload: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.bookClient
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

  getBooks(): Promise<any> {
    return this.handleKafkaSend('get-all-book', {});
  }

  getBookById(id: number): Promise<any> {
    return this.handleKafkaSend('get-book-by-id', id);
  }

  createBook(book: CreateBookDto): Promise<Book> {
    return this.handleKafkaSend<Book>('create-book', { book });
  }

  updateBook(id: number, book: UpdateBookDto): Promise<any> {
    return this.handleKafkaSend('update-book', { id, book });
  }

  deleteBook(id: number): Promise<any> {
    return this.handleKafkaSend('delete-book', id);
  }

  searchBooks(searchBooksDto: any): Promise<any> {
    return this.handleKafkaSend('search-book', { searchBooksDto });
  }

  async onModuleInit() {
    [
      'get-all-book',
      'get-book-by-id',
      'create-book',
      'update-book',
      'delete-book',
      'search-book',
    ].forEach((topic) => this.bookClient.subscribeToResponseOf(topic));
    await this.bookClient.connect();
  }
}
