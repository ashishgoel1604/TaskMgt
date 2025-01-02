import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Role, User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserAuthGuard } from '../guards/UserAuthGuard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Initialize Admin User' })
  @Get('/init')
  initAdminUser() {
    return this.userService.createInitialUser();
  }

  @Post()
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() body: { email: string; password: string }): Promise<User> {
    return this.userService.createUser(body.email, body.password);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  findOne(@Request() req: any, @Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id, req.user);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  delete(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
