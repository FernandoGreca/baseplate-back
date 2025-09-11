import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/features/user/dtos/create-user.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { UserResponse } from 'src/features/user/dtos/response-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGMzMDZjNTViYmY5ZDEwZjk0MmJkNTAiLCJ1c2VyIjp7Il9pZCI6IjY4YzMwNmM1NWJiZjlkMTBmOTQyYmQ1MCIsIm5hbWUiOiJGZXJuYW5kbyBHcmVjYSIsImVtYWlsIjoiZmVybmFuZG9ncmVjYUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRWQnN1UXBWS2RiN1hnSzlJQmdxWDZlNHRNWERsNExlWnZFL0VmZm91Z2NDMkp4Zmk1ckcveSIsImNyZWF0ZWRfYXQiOiIyMDI1LTA5LTExVDE3OjI4OjM3LjExOVoiLCJ1cGRhdGVkX2F0IjoiMjAyNS0wOS0xMVQxNzoyODozNy4xMTlaIn0sImlhdCI6MTc1NzYxMjA5MCwiZXhwIjoxNzU3Njk4NDkwfQ.s6GfvxkaqGrV9xc5cw4V1ZkE-KmTZoPFkFkOhJ-TvEA',
        },
      },
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  @ApiOkResponse({ type: UserResponse })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('change-password')
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password updated successfully' },
      },
    },
  })
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
