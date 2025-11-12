import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/features/user/user.module';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-me'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
