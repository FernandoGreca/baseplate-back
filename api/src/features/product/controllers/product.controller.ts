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
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductResponse } from '../dtos/response-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductService } from '../services/product.service';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({ type: ProductResponse })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Products list',
    type: ProductResponse,
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
    return this.productService.findAll({
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
    description: 'Product',
    type: ProductResponse,
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateProductDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
