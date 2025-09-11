import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ApiQueryList } from 'src/decorators/query-list.decorator';
import { AuthGuard } from 'src/features/auth/guards/auth.guard';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponse } from '../dtos/response-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from '../services/user.service';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: UserResponse })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Users list',
    type: UserResponse,
    isArray: true,
  })
  @ApiQueryList()
  async getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('fields') fields?: string,
    @Query('sort') sort?: string,
    @Query('query') query?: string,
    @Query('dont_count') dont_count?: boolean,
  ) {
    return this.userService.findAll({
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
      fields,
      sort,
      query,
      dont_count: dont_count === undefined ? false : dont_count,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'User',
    type: UserResponse,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
