import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, Role } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// Create a mock repository for User entity
const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInitialUser', () => {
    it('should create an initial admin user if none exists', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null); // Simulate no initial user found
      mockUserRepository.save.mockResolvedValueOnce({ email: 'admin@gmail.com', role: Role.ADMIN });

      const user = await service.createInitialUser();

      expect(user.email).toBe('admin@gmail.com');
      expect(user.role).toBe(Role.ADMIN);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if initial admin user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ email: 'admin@gmail.com', role: Role.ADMIN });

      await expect(service.createInitialUser()).rejects.toThrowError(BadRequestException);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      mockUserRepository.create.mockReturnValue({ email: 'test@example.com', password: 'password123', role: Role.USER });
      mockUserRepository.save.mockResolvedValueOnce({ email: 'test@example.com', password: 'password123', role: Role.USER });

      const user = await service.createUser('test@example.com', 'password123', false);

      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe(Role.USER);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      mockUserRepository.find.mockResolvedValueOnce([
        { email: 'test1@example.com', role: Role.USER },
        { email: 'test2@example.com', role: Role.ADMIN },
      ]);

      const users = await service.findAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].email).toBe('test1@example.com');
      expect(users[1].email).toBe('test2@example.com');
    });
  });

  describe('findUserById', () => {
    it('should return user details if ID is provided', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ id: 1, email: 'test@example.com', role: Role.USER });

      const user = await service.findUserById(1, { id: 1, role: Role.USER });

      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException if user is not allowed to access another user\'s info', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ id: 2, email: 'other@example.com', role: Role.USER });

      await expect(service.findUserById(2, { id: 1, role: Role.USER })).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      mockUserRepository.delete.mockResolvedValueOnce(undefined);

      await expect(service.deleteUser(1)).resolves.not.toThrow();
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
