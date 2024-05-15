import { Controller, NotFoundException, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateBookDto } from './dto/create.dto';
import { SearchBooksDto } from './dto/search.dto';
import { UpdateBookDto } from './dto/update.dto';
import { ExceptionFilter } from './filters/rpc-exception.filter';

@Controller()
@UseFilters(new ExceptionFilter())
export class AppController {
  constructor(private readonly booksService: AppService) {}

  // // POST: Create a new book
  // @Post()
  // async create(@Body() createBookDto: CreateBookDto) {
  //   return this.booksService.create(createBookDto);
  // }

  // // PUT: Update an existing book
  // @Put(':id')
  // async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
  //   return this.booksService.update(id, updateBookDto);
  // }

  // // DELETE: Remove a book
  // @Delete(':id')
  // async remove(@Param('id') id: number) {
  //   return this.booksService.remove(id);
  // }

  // // GET: Search for books
  // @Get('search')
  // async findAll(@Query() searchBooksDto: SearchBooksDto) {
  //   return this.booksService.findAll(searchBooksDto);
  // }

  // // GET: Retrieve a single book by ID
  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   const book = await this.booksService.findOne(id);
  //   if (!book) {
  //     throw new NotFoundException(`Book with ID ${id} not found.`);
  //   }
  //   return book;
  // }

  @MessagePattern('search-book')
  async getBooks(searchBooksDto: SearchBooksDto) {
    return this.booksService.findAll(searchBooksDto);
  }

  @MessagePattern('get-book-by-id')
  async getBookById(id: number) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found.`);
    }
    return JSON.stringify(book);
  }

  @MessagePattern('create-book')
  async createBook({ book }: { book: CreateBookDto }) {
    const createdBook = await this.booksService.create(book);
    return JSON.stringify(createdBook);
  }

  @MessagePattern('update-book')
  async updateBook({ id, book }: { id: number; book: UpdateBookDto }) {
    return this.booksService.update(id, book);
  }

  @MessagePattern('delete-book')
  async deleteBook(id: number) {
    await this.booksService.remove(id);
    return JSON.stringify('Book deleted successfully');
  }
}
