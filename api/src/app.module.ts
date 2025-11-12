import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './features/user/user.module';
import { ProductModule } from './features/product/product.module';
import { PriceModule } from './features/price/price.module';
import { StockModule } from './features/stock/stock.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/baseplate'),
    ConfigModule.forRoot({ envFilePath: '../../api/.env' }),
    UserModule,
    ProductModule,
    PriceModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
