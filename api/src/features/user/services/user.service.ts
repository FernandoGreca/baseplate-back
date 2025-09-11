import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../entities/user.entity';
import { HydratedDocument, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from 'src/features/auth/dtos/change-password.dto';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class UserService extends BaseService<HydratedDocument<User>> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<HydratedDocument<User>>,
  ) {
    super(userModel);
  }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await newUser.save();

    const { password, ...newUserTransformed } = newUser.toObject();

    return newUserTransformed;
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string, returnPassword?: boolean) {
    if (returnPassword) {
      return await this.userModel.findOne({ email }).select('+password');
    } else {
      return await this.userModel.findOne({ email });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  async remove(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, password } = changePasswordDto;

    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    return { message: 'Password updated successfully' };
  }
}
