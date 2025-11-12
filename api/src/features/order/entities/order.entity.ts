import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/features/product/entities/product.entity';

export type OrderDocument = HydratedDocument<Order>;

class OrderItem {
  @Prop({ type: Types.ObjectId, ref: Product.name })
  product?: Types.ObjectId;

  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  unit_price: number;

  @Prop({ required: true })
  quantity: number;
}

class ShippingAddress {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  number: string;

  @Prop()
  complement?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  zip_code: string;
}

class PaymentInfo {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  transaction_id?: string;

  @Prop()
  paid_at?: Date;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_: OrderDocument, ret: Record<string, any>) => {
      ret.order_id = ret._id;
      delete ret._id;
      delete ret.id;

      if (Array.isArray(ret.items)) {
        ret.items = ret.items.map((item: Record<string, any>) => {
          if (item.product) {
            item.product_id = item.product.toString();
          }
          delete item.product;
          return item;
        });
      }

      return ret;
    },
  },
})
export class Order {
  @Prop({ required: true })
  buyer_name: string;

  @Prop({ required: true })
  buyer_email: string;

  @Prop()
  buyer_phone?: string;

  @Prop({ type: ShippingAddress, required: true })
  shipping_address: ShippingAddress;

  @Prop({ type: PaymentInfo, required: true })
  payment_info: PaymentInfo;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  order_total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
