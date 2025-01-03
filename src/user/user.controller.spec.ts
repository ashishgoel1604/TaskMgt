import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from '../entities/user.entity';
import { UserAuthGuard } from '../guards/UserAuthGuard';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Mock the UserService
const mockUserService = {
  createInitialUser: jest.fn(),
  createUser: jest.fn(),
  findAllUsers: jest.fn(),
  findUserById: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initAdminUser', () => {
    it('should initialize an admin user', async () => {
      mockUserService.createInitialUser.mockResolvedValueOnce({ email: 'admin@gmail.com', role: Role.ADMIN });
      
      const result = await controller.initAdminUser();
      expect(result.email).toBe('admin@gmail.com');
    });

    it('should throw error if user already exists', async () => {
      mockUserService.createInitialUser.mockRejectedValueOnce(new BadRequestException('User already exists'));

      await expect(controller.initAdminUser()).rejects.toThrow(BadRequestException);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123', role: Role.USER };
      mockUserService.createUser.mockResolvedValueOnce(mockUser);
      
      const result = await controller.create({ email: 'test@example.com', password: 'password123', is_admin: false });
      
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe(Role.USER);
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { email: 'user1@example.com', role: Role.USER },
        { email: 'user2@example.com', role: Role.ADMIN },
      ];
      mockUserService.findAllUsers.mockResolvedValueOnce(mockUsers);

      const result = await controller.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('user1@example.com');
    });
  });

  describe('findUserInfo', () => {
    it('should return user info for logged-in user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: Role.USER };
      mockUserService.findUserById.mockResolvedValueOnce(mockUser);
      
      const result = await controller.findUserInfo({ user: mockUser });
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserService.deleteUser.mockResolvedValueOnce(undefined);
      
      await expect(controller.delete(1)).resolves.not.toThrow();
    });
  });
});
