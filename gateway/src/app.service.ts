import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientKafka,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  getAllBook() {
    return new Promise((resolve) => {
      this.bookClient.send('get-all-book', {}).subscribe((response: any) => {
        resolve(response);
      });
    });
  }
}
