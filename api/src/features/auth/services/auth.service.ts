import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/features/user/dtos/create-user.dto';
import { UserService } from 'src/features/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email, true);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const { password, ...newUserTransformed } = user.toObject();

    const payload = { sub: user._id, user: newUserTransformed };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    return await this.usersService.changePassword(changePasswordDto);
  }
}
