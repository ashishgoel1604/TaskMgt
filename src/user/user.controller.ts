import { Controller, Post, Get, Param, Body, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
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
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,  // Response type
  })
  @ApiBody({
    description: 'The user creation payload',
    type: Object,
    examples: {
      'application/json': {
        value: {
          is_admin: true,  // Correctly define an example email
          email: 'test@example.com',  // Correctly define an example email
          password: 'strongpassword123',  // Correctly define an example password
        },
      },
    },
  })
  create(@Body() body: { email: string; password: string, is_admin: boolean }): Promise<User> {
    return this.userService.createUser(body.email, body.password, body.is_admin);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN)
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'The user ID' })
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  findOne(@Request() req: any, @Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id, req.user);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN)
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'The user ID' })
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  delete(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
