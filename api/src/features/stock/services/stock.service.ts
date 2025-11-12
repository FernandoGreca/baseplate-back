import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { BaseService } from 'src/base/base.service';
import { Product } from 'src/features/product/entities/product.entity';
import { CreateStockDto } from '../dtos/create-stock.dto';
import { UpdateStockDto } from '../dtos/update-stock.dto';
import { Stock } from '../entities/stock.entity';

@Injectable()
export class StockService extends BaseService<HydratedDocument<Stock>> {
  constructor(
    @InjectModel(Stock.name)
    private readonly stockModel: Model<HydratedDocument<Stock>>,
    @InjectModel(Product.name)
    private readonly productModel: Model<HydratedDocument<Product>>,
  ) {
    super(stockModel);
  }

  async create(createStockDto: CreateStockDto) {
    const product = await this.productModel.findById(createStockDto.product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const stockList = await this.stockModel.find({
      warehouse_location: createStockDto.warehouse_location,
    });

    const existingStock = stockList.find(
      (e) => e.product.toString() === createStockDto.product_id,
    );

    if (existingStock) {
      throw new ConflictException({
        message:
          'A stock entry for this product already exists at the specified warehouse location.',
        existingStockId: existingStock._id,
      });
    }

    const newStock = new this.stockModel(this.mapPayload(createStockDto));
    const savedStock = await newStock.save();

    await this.productModel.updateOne(
      { _id: product._id },
      { $addToSet: { stocks: savedStock._id } },
    );

    return savedStock;
  }

  async findOne(id: string) {
    const stock = await this.stockModel.findById(id);

    if (!stock) throw new NotFoundException('Stock not found');

    return stock;
  }

  async update(id: string, updateStockDto: UpdateStockDto) {
    const stock = await this.stockModel.findById(id);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    if (updateStockDto.product_id) {
      const newProduct = await this.productModel.findById(
        updateStockDto.product_id,
      );
      if (!newProduct) {
        throw new NotFoundException('Product not found');
      }

      if (stock.product.toString() !== newProduct._id.toString()) {
        await this.productModel.updateOne(
          { _id: stock.product },
          { $pull: { stocks: stock._id } },
        );

        await this.productModel.updateOne(
          { _id: newProduct._id },
          { $addToSet: { stocks: stock._id } },
        );
      }
    }

    return await this.stockModel.updateOne(
      { _id: id },
      this.mapPayload(updateStockDto),
    );
  }

  async remove(id: string) {
    const stock = await this.stockModel.findById(id);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    await this.productModel.updateOne(
      { _id: stock.product },
      { $pull: { stocks: stock._id } },
    );

    return await this.stockModel.deleteOne({ _id: id });
  }

  private mapPayload(dto: Partial<CreateStockDto>) {
    const payload: Record<string, unknown> = { ...dto };
    if (dto.product_id) {
      payload.product = new Types.ObjectId(dto.product_id);
      delete payload.product_id;
    }
    return payload;
  }
}
