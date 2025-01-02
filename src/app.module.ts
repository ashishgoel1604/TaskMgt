import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // // Serve static files from the 'public' directory
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public/build'),
    // }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Task, User
      ],
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([Task, User]),
    TaskModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule { }
