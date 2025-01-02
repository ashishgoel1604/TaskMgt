import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, UserService],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User]),
  forwardRef(() => AuthModule),
  forwardRef(() => UserModule),
  ConfigModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      secret: 'defaultSecretKey657876vt',
      signOptions: {
        expiresIn: '14d'
      }
    })
  }),
  ]
})
export class AuthModule { }
