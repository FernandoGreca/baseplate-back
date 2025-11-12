import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './features/user/user.module';
import { ProductModule } from './features/product/product.module';
import { PriceModule } from './features/price/price.module';
import { StockModule } from './features/stock/stock.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost/baseplate'),
      }),
    }),
    UserModule,
    ProductModule,
    PriceModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
