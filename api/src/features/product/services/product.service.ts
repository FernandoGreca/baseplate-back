import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument, Types } from 'mongoose';
import { BaseService } from 'src/base/base.service';
import { PriceService } from 'src/features/price/services/price.service';
import { StockService } from 'src/features/stock/services/stock.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService extends BaseService<HydratedDocument<Product>> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<HydratedDocument<Product>>,
    private readonly priceService: PriceService,
    private readonly stockService: StockService,
  ) {
    super(productModel);
  }

  async create(createProductDto: CreateProductDto) {
    const { price, stocks, ...productData } = createProductDto;
    const newProduct = new this.productModel(productData);
    await newProduct.save();

    if (price) {
      const createdPrice = await this.priceService.create({
        ...price,
        product_id: newProduct._id.toString(),
      });

      newProduct.price = createdPrice._id;
      await newProduct.save();
    }

    if (stocks?.length) {
      await Promise.all(
        stocks.map((stock) =>
          this.stockService.create({
            ...stock,
            product_id: newProduct._id.toString(),
          }),
        ),
      );
    }

    return await this.findOne(newProduct._id.toString());
  }

  async findAll(options = {}) {
    const result = await super.findAll(options);
    if (result && Array.isArray(result.results)) {
      await this.productModel.populate(result.results, [
        { path: 'price' },
        { path: 'stocks' },
      ]);
    }
    return result;
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate(['price', 'stocks']);

    if (!product) throw new NotFoundException('Product not founded');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productModel.updateOne({ _id: id }, updateProductDto);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) throw new NotFoundException('Product not founded');

    const priceRef = product.price as
      | undefined
      | Types.ObjectId
      | { _id?: Types.ObjectId };
    const priceId =
      priceRef instanceof Types.ObjectId
        ? priceRef.toString()
        : priceRef?._id?.toString();

    const stockRefs = (product.stocks ?? []) as Array<
      Types.ObjectId | { _id?: Types.ObjectId }
    >;
    const stockIds = stockRefs
      .map((ref) =>
        ref instanceof Types.ObjectId ? ref.toString() : ref?._id?.toString(),
      )
      .filter((id): id is string => Boolean(id));

    const deleteResult = await this.productModel.deleteOne({ _id: id });

    if (priceId) {
      await this.priceService.remove(priceId);
    }
    await Promise.all(
      stockIds.map((stockId) => this.stockService.remove(stockId)),
    );

    return deleteResult;
  }
}
