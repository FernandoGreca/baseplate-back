import { ApiProperty } from '@nestjs/swagger';

class OrderItemResponse {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  unit_price: number;

  @ApiProperty()
  quantity: number;
}

class ShippingAddressResponse {
  @ApiProperty()
  street: string;

  @ApiProperty()
  number: string;

  @ApiProperty({ required: false })
  complement?: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  zip_code: string;
}

class PaymentInfoResponse {
  @ApiProperty()
  method: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  transaction_id?: string;

  @ApiProperty({ required: false })
  paid_at?: Date;
}

export class OrderResponse {
  @ApiProperty()
  order_id: string;

  @ApiProperty()
  buyer_name: string;

  @ApiProperty()
  buyer_email: string;

  @ApiProperty({ required: false })
  buyer_phone?: string;

  @ApiProperty({ type: ShippingAddressResponse })
  shipping_address: ShippingAddressResponse;

  @ApiProperty({ type: PaymentInfoResponse })
  payment_info: PaymentInfoResponse;

  @ApiProperty({ type: [OrderItemResponse] })
  items: OrderItemResponse[];

  @ApiProperty()
  order_total: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
