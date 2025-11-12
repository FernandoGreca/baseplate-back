import { ApiProperty } from '@nestjs/swagger';

export class StockResponse {
  @ApiProperty()
  stock_id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ required: false })
  warehouse_location?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
