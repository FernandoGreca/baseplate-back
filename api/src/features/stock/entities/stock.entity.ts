import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StockDocument = HydratedDocument<Stock>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_: StockDocument, ret: Record<string, unknown>) => {
      const target = ret as {
        _id?: Types.ObjectId;
        id?: string;
        stock_id?: string;
        product?: Types.ObjectId;
        product_id?: string;
      };

      target.stock_id = target._id?.toString();
      target.product_id = target.product?.toString();
      delete target._id;
      delete target.id;
      delete target.product;
      return ret;
    },
  },
})
export class Stock {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, type: Number, default: 0 })
  quantity: number;

  @Prop()
  warehouse_location?: string;

  constructor(init?: Partial<Stock>) {
    Object.assign(this, init);
  }
}

export const StockSchema = SchemaFactory.createForClass(Stock);
