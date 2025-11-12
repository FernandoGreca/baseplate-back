import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateIf,
  ValidateNested,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PromotionDateRangeValidator } from '../../../common/validators/promotion-date-range.validator';

export class ProductPriceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ example: 129.9 })
  value: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ValidateIf((o: ProductPriceDto) => o.on_promotion === true)
  @IsNotEmpty()
  @ApiProperty({ example: 99.9, required: false })
  promotional_value?: number;

  @ValidateIf((o: ProductPriceDto) => o.on_promotion === true)
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-11-10T00:00:00.000Z',
    required: false,
  })
  promotion_start?: string;

  @ValidateIf((o: ProductPriceDto) => o.on_promotion === true)
  @IsDateString()
  @IsNotEmpty()
  @Validate(PromotionDateRangeValidator)
  @ApiProperty({
    example: '2025-11-20T23:59:59.000Z',
    required: false,
  })
  promotion_end?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false })
  on_promotion?: boolean;
}

export class ProductStockDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 150 })
  quantity: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Main warehouse', required: false })
  warehouse_location?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Black T-Shirt' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'A classic black t-shirt made from soft, breathable cotton',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SKU-123' })
  sku: string;

  @ValidateNested()
  @Type(() => ProductPriceDto)
  @IsOptional()
  @ApiProperty({ type: ProductPriceDto, required: false })
  price?: ProductPriceDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Clothing' })
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Acme', required: false })
  brand?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false, default: true })
  is_active?: boolean;

  @ValidateNested({ each: true })
  @Type(() => ProductStockDto)
  @IsOptional()
  @ApiProperty({ type: [ProductStockDto], required: false })
  stocks?: ProductStockDto[];
}
