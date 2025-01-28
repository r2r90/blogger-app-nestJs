import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command.';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUsersDto } from './dto/get-users.dto';

@SkipThrottle()
@UseGuards(AuthGuard('basic'))
@ApiTags('Super-Admin User')
@Controller('sa/users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new item',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns the newly created item',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If the inputModel has incorrect values',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  create(@Body() createUserDto: CreateUserDto) {
    const { login, password, email } = createUserDto;
    const isAdmin = true;

    return this.commandBus.execute(
      new CreateUserCommand(login, password, email, isAdmin),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiQuery({
    name: 'searchNameTerm',
    type: 'string',
    default: null,
    required: false,
    description:
      'Search term for user: Name should contains this term in any position',
    example: 'find-blog',
  })
  @ApiQuery({
    name: 'sortBy',
    type: 'string',
    default: 'createdAt', // TS2304: Cannot find name createdAt ???
    required: false,
    description: 'Field by which to sort the items',
  })
  @ApiQuery({
    name: 'sortDirection',
    type: 'string',
    default: 'desc',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Field by which to sort the items',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: 'number',
    default: 1,
    required: false,
    description: 'pageNumber is number of items that should be returned',
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'number',
    default: 10,
    required: false,
    description: 'pageSize is quantity size per page that should be returned',
  })
  getAll(@Query() query: GetUsersDto) {
    return this.usersService.getAllUsers(query);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove Item',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item Not found',
  })
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
