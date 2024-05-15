import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create.dto';
import { SearchBooksDto } from './dto/search.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateBookDto } from './dto/update.dto';
import { Book } from './entities/book.entity';

@Controller('books')
@ApiTags('Books')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // POST: Create a new book
  @Post()
  @Roles('super', 'admin')
  @ApiBody({ type: CreateBookDto })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.createBook(createBookDto);
  }

  // GET: Retrieve all books
  @Get()
  async findAll(@Query() searchBooksDto: SearchBooksDto) {
    return this.booksService.searchBooks(searchBooksDto);
  }

  // GET: Retrieve a single book by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    console.log(id);
    return this.booksService.getBookById(id);
  }

  // DELETE: Remove a book
  @Delete(':id')
  @Roles('super', 'admin')
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: number) {
    return this.booksService.deleteBook(id);
  }

  // PUT: Update an existing book
  @Put(':id')
  @Roles('super', 'admin')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateBookDto })
  async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.updateBook(id, updateBookDto);
  }
}
