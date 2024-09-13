import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { CreateUserDto } from './dto/create.user.dto';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('basic'))
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.usersService.getAllUsers(query);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('basic'))
  delete(@Param('id', IsObjectIdPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
