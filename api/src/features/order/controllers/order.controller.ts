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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/features/auth/guards/auth.guard';
import { ApiQueryList } from 'src/decorators/query-list.decorator';
import { CreateOrderDto } from '../dtos/order-item.dto';
import { OrderResponse } from '../dtos/response-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderService } from '../services/order.service';

@ApiTags('order')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @ApiOkResponse({ type: OrderResponse })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOkResponse({ type: OrderResponse, isArray: true })
  @ApiQueryList()
  async getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('fields') fields?: string,
    @Query('sort') sort?: string,
    @Query('query') query?: string,
    @Query('dont_count') dont_count?: boolean,
  ) {
    return this.orderService.findAll({
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
      fields,
      sort,
      query,
      dont_count: dont_count === undefined ? false : dont_count,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderResponse })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateOrderDto })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
