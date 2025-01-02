import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TaskService, UserService, AuthService, JwtService],
  controllers: [TaskController],
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ]
})
export class TaskModule { }
