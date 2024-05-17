import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create.dto';
import { SearchBooksDto } from './dto/search.dto';
import { UpdateBookDto } from './dto/update.dto';
import { Book, BookStatus } from './entities/book.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}
  // Create a new book
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = await this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  // Update an existing book
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id: id });
    if (!book) {
      throw new RpcException({
        message: `Book with ID ${id} not found.`,
        status: 404,
      });
    }

    return this.booksRepository.save({ ...book, ...updateBookDto });
  }

  // Delete a book
  async remove(id: number): Promise<void> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) {
      throw new RpcException({
        message: `Book with ID ${id} not found.`,
        status: 404,
      });
    }
  }

  // Find books by title, author, or genre
  async findAll(searchBooksDto: SearchBooksDto): Promise<Book[]> {
    const { title, author, genre } = searchBooksDto;
    const query = this.booksRepository.createQueryBuilder('book');

    if (title) {
      query.andWhere('book.title ILIKE :title', { title: `%${title}%` });
    }

    if (author) {
      query.andWhere('book.author ILIKE :author', { author: `%${author}%` });
    }

    if (genre) {
      query.andWhere('book.genre ILIKE :genre', { genre: `%${genre}%` });
    }

    return query.getMany();
  }

  // Find a single book by ID
  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id: id });
    if (!book) {
      throw new RpcException({
        message: `Book with ID ${id} not found.`,
        status: 404,
      });
    }
    return book;
  }

  // Update status of a book
  async updateStatus(id: number, status: BookStatus): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id: id });
    if (!book) {
      throw new RpcException({
        message: `Book with ID ${id} not found.`,
        status: 404,
      });
    }
    return this.booksRepository.save({ ...book, status: status });
  }
}
