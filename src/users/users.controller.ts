import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { CreateUserDto } from './dto/create.user.dto';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.usersService.getAllUsers(query);
  }

  @Delete(':id')
  delete(@Param('id', IsObjectIdPipe) id: string) {}
}
