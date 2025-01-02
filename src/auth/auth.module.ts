import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AuthService, UserService],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User]),
  forwardRef(() => AuthModule),
  forwardRef(() => UserModule),
    JwtModule,

  ]
})
export class AuthModule { }
