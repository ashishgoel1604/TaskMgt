import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserAuthGuard } from '../guards/UserAuthGuard';
import { AuthService } from '../auth/auth.service';  // Import AuthService
import { ExecutionContext } from '@nestjs/common';
import { Role, User } from '../entities/user.entity';

// Mocking UserAuthGuard
class MockUserAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true; // Always allow the request to pass
  }
}

// Mocking AuthService (necessary if your guard relies on it)
class MockAuthService {
  validateUser() {
    return { id: 1, role: Role.ADMIN }; // Mock return value for validation
  }
}

// Mocking UserService
const mockUserService = {
  createUser: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'strongpassword123', is_admin: true }),
  findAllUsers: jest.fn().mockResolvedValue([
    { id: 1, email: 'test@example.com', password: 'strongpassword123', is_admin: true },
    { id: 2, email: 'user@example.com', password: 'password123', is_admin: false },
  ]),
  findUserById: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'strongpassword123', is_admin: true }),
  deleteUser: jest.fn().mockResolvedValue(undefined),
  createInitialUser: jest.fn().mockResolvedValue({ id: 1, email: 'admin@example.com', password: 'adminpassword', is_admin: true }),
};

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useClass: MockAuthService },  // Provide the mocked AuthService
        { provide: UserAuthGuard, useClass: MockUserAuthGuard }, // Mock the guard
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initAdminUser', () => {
    it('should initialize an admin user', async () => {
      const result = await controller.initAdminUser();
      expect(result).toEqual({ id: 1, email: 'admin@example.com', password: 'adminpassword', is_admin: true });
      expect(userService.createInitialUser).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto = { email: 'test@example.com', password: 'strongpassword123', is_admin: true };
      const result = await controller.create(createDto);
      expect(result).toEqual({ id: 1, email: 'test@example.com', password: 'strongpassword123', is_admin: true });
      expect(userService.createUser).toHaveBeenCalledWith(createDto.email, createDto.password, createDto.is_admin);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([
        { id: 1, email: 'test@example.com', password: 'strongpassword123', is_admin: true },
        { id: 2, email: 'user@example.com', password: 'password123', is_admin: false },
      ]);
      expect(userService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findUserInfo', () => {
    it('should return the current user info', async () => {
      const result = await controller.findUserInfo({ user: { id: 1 } });
      expect(result).toEqual({ id: 1, email: 'test@example.com', password: 'strongpassword123', is_admin: true });
      expect(userService.findUserById).toHaveBeenCalledWith(null, { id: 1 });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await controller.findOne({ user: { id: 1 } }, 1);
      expect(result).toEqual({ id: 1, email: 'test@example.com', password: 'strongpassword123', is_admin: true });
      expect(userService.findUserById).toHaveBeenCalledWith(1, { id: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(userService.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
