import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceController } from './controllers/price.controller';
import { PriceService } from './services/price.service';
import { Price, PriceSchema } from './entities/price.entity';
import { Product, ProductSchema } from '../product/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Price.name, schema: PriceSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
