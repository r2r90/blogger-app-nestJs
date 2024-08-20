import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { CreateUserDto } from './dto/create.user.dto';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.save(createUserDto);
  }

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.usersService.getAllUsers(query);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', IsObjectIdPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
