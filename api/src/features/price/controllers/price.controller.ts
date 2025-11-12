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
import { CreatePriceDto } from '../dtos/create-price.dto';
import { UpdatePriceDto } from '../dtos/update-price.dto';
import { PriceResponse } from '../dtos/response-price.dto';
import { PriceService } from '../services/price.service';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @ApiBody({ type: CreatePriceDto })
  @ApiOkResponse({ type: PriceResponse })
  create(@Body() createPriceDto: CreatePriceDto) {
    return this.priceService.create(createPriceDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Prices list',
    type: PriceResponse,
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
    return this.priceService.findAll({
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
    description: 'Price',
    type: PriceResponse,
  })
  findOne(@Param('id') id: string) {
    return this.priceService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdatePriceDto })
  update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    return this.priceService.update(id, updatePriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priceService.remove(id);
  }
}
