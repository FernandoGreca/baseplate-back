import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Price } from 'src/features/price/entities/price.entity';
import { Stock } from 'src/features/stock/entities/stock.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_: ProductDocument, ret: Record<string, unknown>) => {
      const objectWithId = ret as { _id?: Types.ObjectId; id?: string } & {
        product_id?: string;
      };

      objectWithId.product_id = objectWithId._id?.toString();
      delete objectWithId._id;
      delete objectWithId.id;
      return ret;
    },
  },
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ type: Types.ObjectId, ref: Price.name })
  price?: Price | Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop()
  brand?: string;

  @Prop({ required: true, default: true })
  is_active: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: Stock.name }] })
  stocks?: Array<Stock | Types.ObjectId>;

  constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
