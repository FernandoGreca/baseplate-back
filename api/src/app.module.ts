import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './features/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/baseplate'),
    ConfigModule.forRoot({ envFilePath: '../../api/.env' }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
