import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOK_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'book-service' + uuidv4(),
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'book-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
