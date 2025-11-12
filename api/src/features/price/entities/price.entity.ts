import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PriceDocument = HydratedDocument<Price>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_: PriceDocument, ret: Record<string, unknown>) => {
      const target = ret as {
        _id?: Types.ObjectId;
        id?: string;
        price_id?: string;
        product?: Types.ObjectId;
        product_id?: string;
      };

      target.price_id = target._id?.toString();
      target.product_id = target.product?.toString();
      delete target.product;
      delete target._id;
      delete target.id;
      return ret;
    },
  },
})
export class Price {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ type: Number })
  promotional_value?: number;

  @Prop({ type: Date })
  promotion_start?: Date;

  @Prop({ type: Date })
  promotion_end?: Date;

  @Prop({ required: true, default: false })
  on_promotion: boolean;

  constructor(init?: Partial<Price>) {
    Object.assign(this, init);
  }
}

export const PriceSchema = SchemaFactory.createForClass(Price);
