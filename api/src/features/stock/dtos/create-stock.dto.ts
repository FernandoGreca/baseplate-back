import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '68c306c55bbf9d10f942bd50',
    description: 'Product identifier that owns this stock entry',
  })
  product_id: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 150 })
  quantity: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Main warehouse', required: false })
  warehouse_location?: string;
}
