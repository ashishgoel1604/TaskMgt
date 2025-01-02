import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService,AuthService,JwtService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]),
  forwardRef(() => AuthModule)
]
})
export class UserModule { }
