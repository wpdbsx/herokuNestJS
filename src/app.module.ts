import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cat/cat.controller';
import { CatsService } from './cat/cat.service';
import { PrismaService } from './prisma/prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [],
  controllers: [AppController, CatsController, UserController],
  providers: [AppService, CatsService, UserService, PrismaService],
})
export class AppModule {}
