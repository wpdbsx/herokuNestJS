import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, User as UserModel } from '@prisma/client';
import { identity } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async signupUser(
    @Body()
    userData: {
      name: string;
      email: string;
      age: number;
      phoneNumber: string;
      description: string;
    },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
  @Get()
  async users(): Promise<User[]> {
    return this.userService.users();
  }

  @Get('search')
  async searchUser(
    @Body()
    userData: {
      name: string;
      email: string;
      phoneNumber: string;
    },
  ): Promise<UserModel[]> {
    return this.userService.searchUser(userData);
  }

  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    console.log(id);
    return await this.userService.deleteUser({ id: Number(id) });
  }
}
