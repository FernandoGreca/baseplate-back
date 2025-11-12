import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from '@nestjs/class-validator';

class ShippingAddressDto {
  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Apto 45', required: false })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ example: 'Curitiba' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'PR' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Brasil' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '80000-000' })
  @IsString()
  @IsNotEmpty()
  zip_code: string;
}

class PaymentInfoDto {
  @ApiProperty({ example: 'credit_card' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ example: 'paid' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 'txn_123', required: false })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({
    example: '2025-01-15T12:00:00.000Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  paid_at?: string;
}

export class OrderItemDto {
  @ApiProperty({ example: '68c306c55bbf9d10f942bd50' })
  @IsMongoId()
  product_id: string;

  @ApiProperty({ example: 'Black T-Shirt' })
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty({ example: 129.9 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unit_price: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Fernando Greca' })
  @IsString()
  @IsNotEmpty()
  buyer_name: string;

  @ApiProperty({ example: 'fernando@example.com' })
  @IsEmail()
  buyer_email: string;

  @ApiProperty({ example: '+55 41 99999-9999', required: false })
  @IsString()
  @IsOptional()
  buyer_phone?: string;

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address: ShippingAddressDto;

  @ApiProperty({ type: PaymentInfoDto })
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  payment_info: PaymentInfoDto;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
