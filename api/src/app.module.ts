import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/baseplate'), UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
