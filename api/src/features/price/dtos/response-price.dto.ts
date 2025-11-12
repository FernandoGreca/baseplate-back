import { ApiProperty } from '@nestjs/swagger';

export class PriceResponse {
  @ApiProperty()
  price_id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  value: number;

  @ApiProperty({ required: false })
  promotional_value?: number;

  @ApiProperty({ required: false })
  promotion_start?: Date;

  @ApiProperty({ required: false })
  promotion_end?: Date;

  @ApiProperty()
  on_promotion: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
