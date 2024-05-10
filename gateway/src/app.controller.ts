import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  private admin: Admin;
  constructor(
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientKafka,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/book')
  async getBook() {
    const response = await this.appService.getAllBook();
    return response;
  }

  async onModuleInit() {
    this.bookClient.subscribeToResponseOf('get-all-book');
    const kafka = new Kafka({
      clientId: 'book-service',
      brokers: ['localhost:9092'],
    });

    this.admin = kafka.admin();
    const topics = await this.admin.listTopics();

    if (!topics.includes('get-all-book')) {
      await this.admin.createTopics({
        topics: [
          {
            topic: 'get-all-book',
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
    }

    if (!topics.includes('get-all-book.reply')) {
      await this.admin.createTopics({
        topics: [
          {
            topic: 'get-all-book.reply',
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
    }
  }
}
