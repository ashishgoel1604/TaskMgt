import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// Mock the Task repository and UserService
const mockTaskRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockUserService = {
  findUserById: jest.fn(),
};

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      mockTaskRepository.create.mockReturnValue({ title: 'Task 1', description: 'Description' });
      mockTaskRepository.save.mockResolvedValue({ title: 'Task 1', description: 'Description' });

      const task = await service.createTask('Task 1', 'Description');
      expect(task.title).toBe('Task 1');
      expect(task.description).toBe('Description');
    });
  });

  describe('findAllTasks', () => {
    it('should return all tasks for admin', async () => {
      mockTaskRepository.find.mockResolvedValue([{ title: 'Task 1' }, { title: 'Task 2' }]);

      const tasks = await service.findAllTasks({ role: 'ADMIN' });
      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
    });

    it('should return tasks assigned to the user', async () => {
      mockTaskRepository.find.mockResolvedValue([{ title: 'User Task' }]);

      const tasks = await service.findAllTasks({ role: 'USER', id: 1 });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('User Task');
    });
  });

  describe('findTaskById', () => {
    it('should return a task by ID', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ id: 1, title: 'Task 1', user: { id: 1 } });

      const task = await service.findTaskById(1, { id: 1 });
      expect(task.title).toBe('Task 1');
    });

    it('should throw UnauthorizedException if user tries to access another user\'s task', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ id: 1, title: 'Task 1', user: { id: 2 } });

      await expect(service.findTaskById(1, { id: 1 })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if task is not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findTaskById(1, { id: 1 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update the task status successfully', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ id: 1, title: 'Task 1', user: { id: 1 }, status: TaskStatus.PENDING });
      mockTaskRepository.save.mockResolvedValue({ id: 1, title: 'Task 1', user: { id: 1 }, status: TaskStatus.COMPLETED });

      const task = await service.updateTaskStatus(1, TaskStatus.COMPLETED, { id: 1 });
      expect(task.status).toBe(TaskStatus.COMPLETED);
    });

    it('should throw UnauthorizedException if user tries to update another user\'s task', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ id: 1, title: 'Task 1', user: { id: 2 }, status: TaskStatus.PENDING });

      await expect(service.updateTaskStatus(1, TaskStatus.COMPLETED, { id: 1 })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if task is not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.updateTaskStatus(1, TaskStatus.COMPLETED, { id: 1 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('assignTaskToUser', () => {
    it('should assign task to a user', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ id: 1, title: 'Task 1' });
      mockUserService.findUserById.mockResolvedValue({ id: 2 });

      mockTaskRepository.save.mockResolvedValue({ id: 1, title: 'Task 1', user: { id: 2 } });

      const task = await service.assignTaskToUser(1, 2, { id: 1 });
      expect(task.user.id).toBe(2);
    });

    it('should throw BadRequestException if task is not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.assignTaskToUser(1, 2, { id: 1 })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ id: 1 });
      mockUserService.findUserById.mockResolvedValue(null);

      await expect(service.assignTaskToUser(1, 2, { id: 1 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await expect(service.deleteTask(1)).resolves.not.toThrow();
    });
  });
});
