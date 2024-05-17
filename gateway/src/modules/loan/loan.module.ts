import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { BooksModule } from '../books/books.module';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LOAN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'loan-service' + uuidv4(),
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'loan-consumer',
          },
        },
      },
    ]),
    BooksModule,
  ],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
