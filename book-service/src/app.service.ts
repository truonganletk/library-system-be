import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAllBook() {
    return [
      'Book 1',
      'Book 2',
      'Book 3',
      'Book 4',
      'Book 5',
      'Book 6',
      'Book 7',
    ];
  }
}
