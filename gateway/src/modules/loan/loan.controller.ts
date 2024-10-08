import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('loan')
@ApiTags('Loan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Get()
  @Roles('super', 'admin')
  @ApiQuery({ name: 'status', type: String, example: 'all' })
  async findAll(@Query('status') status: string) {
    return this.loanService.findAll(status);
  }

  @Get('overdue')
  @Roles('super', 'admin')
  async findOverdueBooks() {
    return this.loanService.findOverdueBooks();
  }

  @Post()
  @ApiBody({ type: CreateLoanDto })
  async create(@Body() createLoanDto: CreateLoanDto, @Request() req) {
    createLoanDto.user_id = req.user.id;
    if (createLoanDto.due_date < createLoanDto.start_date) {
      throw new HttpException('Due date cannot be before start date', 400);
    }
    return this.loanService.create(createLoanDto);
  }

  @Post('return/:id')
  @ApiParam({ name: 'id', type: Number })
  async returnBook(@Param('id') id: number, @Request() req) {
    return this.loanService.returnBook(id, req.user.id);
  }

  @Post('accept')
  @Roles('super', 'admin')
  @ApiBody({ schema: { example: { id: 1 } } })
  async acceptLoan(@Body('id') id: number) {
    return this.loanService.acceptLoan(id);
  }

  @Get('user')
  async getLoanByUser(@Request() req) {
    return this.loanService.getLoanByUserId(req.user.id);
  }
}
