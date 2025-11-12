import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ApiQueryList } from 'src/decorators/query-list.decorator';
import { AuthGuard } from 'src/features/auth/guards/auth.guard';
import { CreateStockDto } from '../dtos/create-stock.dto';
import { UpdateStockDto } from '../dtos/update-stock.dto';
import { StockResponse } from '../dtos/response-stock.dto';
import { StockService } from '../services/stock.service';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @ApiBody({ type: CreateStockDto })
  @ApiOkResponse({ type: StockResponse })
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Stock entries list',
    type: StockResponse,
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
    return this.stockService.findAll({
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
    description: 'Stock entry',
    type: StockResponse,
  })
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateStockDto })
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
