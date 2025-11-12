import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateIf,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PromotionDateRangeValidator } from '../../../common/validators/promotion-date-range.validator';

export class CreatePriceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '68c306c55bbf9d10f942bd50',
    description: 'Product identifier that owns this price',
  })
  product_id: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ example: 129.9 })
  value: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ValidateIf((o: CreatePriceDto) => o.on_promotion === true)
  @IsNotEmpty()
  @ApiProperty({ example: 99.9, required: false })
  promotional_value?: number;

  @ValidateIf((o: CreatePriceDto) => o.on_promotion === true)
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-11-10T00:00:00.000Z',
    required: false,
  })
  promotion_start?: string;

  @ValidateIf((o: CreatePriceDto) => o.on_promotion === true)
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
  @ApiProperty({ example: true, required: false, default: false })
  on_promotion?: boolean;
}
