import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UserService],
  controllers: [UserController],
   imports:[TypeOrmModule.forFeature([User])]
})
export class UserModule {}
