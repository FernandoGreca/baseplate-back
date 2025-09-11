import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { UserModule } from 'src/features/user/user.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
