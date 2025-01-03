import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskStatus } from '../entities/task.entity';
import { Role } from '../entities/user.entity';
import { UserAuthGuard } from '../guards/UserAuthGuard';
import { BadRequestException } from '@nestjs/common';

// Mock the TaskService
const mockTaskService = {
  createTask: jest.fn(),
  findAllTasks: jest.fn(),
  findTaskById: jest.fn(),
  updateTaskStatus: jest.fn(),
  assignTaskToUser: jest.fn(),
  deleteTask: jest.fn(),
};

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      mockTaskService.createTask.mockResolvedValue({ title: 'Task 1', description: 'Description' });

      const task = await controller.create({ title: 'Task 1', description: 'Description' });
      expect(task.title).toBe('Task 1');
    });
  });

  describe('findAll', () => {
    it('should return all tasks for admin', async () => {
      mockTaskService.findAllTasks.mockResolvedValue([{ title: 'Task 1' }, { title: 'Task 2' }]);

      const tasks = await controller.findAll({ user: { role: Role.ADMIN } });
      expect(tasks).toHaveLength(2);
    });

    it('should return tasks assigned to the user', async () => {
      mockTaskService.findAllTasks.mockResolvedValue([{ title: 'User Task' }]);

      const tasks = await controller.findAll({ user: { role: Role.USER, id: 1 } });
      expect(tasks).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      mockTaskService.findTaskById.mockResolvedValue({ title: 'Task 1' });

      const task = await controller.findOne({ user: { id: 1 } }, 1);
      expect(task.title).toBe('Task 1');
    });

    it('should throw BadRequestException if task is not found', async () => {
      mockTaskService.findTaskById.mockResolvedValue(null);

      await expect(controller.findOne({ user: { id: 1 } }, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('should update task status successfully', async () => {
      mockTaskService.updateTaskStatus.mockResolvedValue({ status: TaskStatus.COMPLETED });

      const task = await controller.updateStatus({ user: { id: 1 } }, 1, { status: TaskStatus.COMPLETED });
      expect(task.status).toBe(TaskStatus.COMPLETED);
    });
  });

  describe('assign', () => {
    it('should assign task to a user', async () => {
      mockTaskService.assignTaskToUser.mockResolvedValue({ user: { id: 2 } });

      const task = await controller.assign({ user: { id: 1 } }, 1, 2);
      expect(task.user.id).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete task successfully', async () => {
      mockTaskService.deleteTask.mockResolvedValue(undefined);

      await expect(controller.delete(1)).resolves.not.toThrow();
    });
  });
});
