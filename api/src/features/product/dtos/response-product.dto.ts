import { ApiProperty } from '@nestjs/swagger';
import { PriceResponse } from 'src/features/price/dtos/response-price.dto';
import { StockResponse } from 'src/features/stock/dtos/response-stock.dto';

export class ProductResponse {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ required: false })
  brand?: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ type: () => PriceResponse, required: false })
  price?: PriceResponse;

  @ApiProperty({ type: () => [StockResponse], required: false })
  stocks?: StockResponse[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
