import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { BaseService } from 'src/base/base.service';
import { CreatePriceDto } from '../dtos/create-price.dto';
import { UpdatePriceDto } from '../dtos/update-price.dto';
import { Price } from '../entities/price.entity';
import { Product } from 'src/features/product/entities/product.entity';

@Injectable()
export class PriceService extends BaseService<HydratedDocument<Price>> {
  constructor(
    @InjectModel(Price.name)
    private readonly priceModel: Model<HydratedDocument<Price>>,
    @InjectModel(Product.name)
    private readonly productModel: Model<HydratedDocument<Product>>,
  ) {
    super(priceModel);
  }

  async create(createPriceDto: CreatePriceDto) {
    const product = await this.productModel.findById(createPriceDto.product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.price)
      throw new BadRequestException({
        message: 'A price already exists for this product',
        existingPriceId: product.price,
      });

    const newPrice = new this.priceModel(this.mapPayload(createPriceDto));
    const savedPrice = await newPrice.save();

    product.price = savedPrice._id;
    await product.save();

    return savedPrice;
  }

  async findOne(id: string) {
    return await this.priceModel.findById(id);
  }

  async update(id: string, updatePriceDto: UpdatePriceDto) {
    return await this.priceModel.updateOne(
      { _id: id },
      this.mapPayload(updatePriceDto),
    );
  }

  async remove(id: string) {
    const price = await this.priceModel.findById(id);
    if (!price) {
      return { acknowledged: true, deletedCount: 0 };
    }

    await this.productModel.updateMany(
      { price: price._id },
      { $unset: { price: '' } },
    );

    return await this.priceModel.deleteOne({ _id: id });
  }

  private mapPayload<T extends Partial<CreatePriceDto>>(dto: T) {
    const payload: Record<string, unknown> = { ...dto };
    this.ensurePromotionFields(dto);
    if (dto.product_id) {
      payload.product = new Types.ObjectId(dto.product_id);
      delete payload.product_id;
    }
    if (dto.promotion_start) {
      payload.promotion_start = new Date(dto.promotion_start);
    }
    if (dto.promotion_end) {
      payload.promotion_end = new Date(dto.promotion_end);
    }
    return payload;
  }

  private ensurePromotionFields(dto: Partial<CreatePriceDto>) {
    if (!dto.on_promotion) return;
    const requiredFields: Array<keyof CreatePriceDto> = [
      'promotional_value',
      'promotion_start',
      'promotion_end',
    ];

    const missing = requiredFields.filter(
      (field) => dto[field] === undefined || dto[field] === null,
    );

    if (missing.length > 0) {
      throw new BadRequestException(
        `${missing.join(', ')} ${
          missing.length > 1 ? 'are' : 'is'
        } required when on_promotion is true`,
      );
    }
  }

  private extractPriceId(
    price?: Types.ObjectId | { _id?: Types.ObjectId } | null,
  ) {
    if (!price) return undefined;
    if (price instanceof Types.ObjectId) return price.toString();
    return price._id?.toString();
  }
}
