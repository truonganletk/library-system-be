import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get all users
  @Get()
  @Roles('super', 'admin')
  findAll() {
    return this.userService.findAll();
  }

  // delete user by id
  @Delete(':id')
  @ApiParam({ name: 'id' })
  @Roles('super')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
