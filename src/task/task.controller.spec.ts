import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserAuthGuard } from '../guards/UserAuthGuard';
import { AuthService } from '../auth/auth.service';  // Import AuthService
import { ExecutionContext } from '@nestjs/common';
import { Role } from '../entities/user.entity';
import { TaskStatus } from '../entities/task.entity';

// Mocking UserAuthGuard
class MockUserAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true; // Mocking the behavior of the guard as always passing
  }
}

// Mocking AuthService
class MockAuthService {
  // Mock methods of AuthService if needed, or leave it empty if not needed
  validateUser() {
    return { id: 1, role: Role.ADMIN }; // Mock return value for validation (adjust based on your real method)
  }
}

// Mocking TaskService
const mockTaskService = {
  createTask: jest.fn().mockResolvedValue({ id: 1, title: 'Task 1', description: 'Task Description' }),
  findAllTasks: jest.fn().mockResolvedValue([{ id: 1, title: 'Task 1', description: 'Task Description' }]),
  findTaskById: jest.fn().mockResolvedValue({ id: 1, title: 'Task 1', description: 'Task Description' }),
  updateTaskStatus: jest.fn().mockResolvedValue({ id: 1, status: TaskStatus.COMPLETED }),
  assignTaskToUser: jest.fn().mockResolvedValue({ id: 1, userId: 1, status: TaskStatus.PENDING }),
  deleteTask: jest.fn().mockResolvedValue(undefined),
};

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: AuthService, useClass: MockAuthService },  // Provide the mocked AuthService
        { provide: UserAuthGuard, useClass: MockUserAuthGuard }, // Mocking the guard
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createDto = { title: 'Task 1', description: 'Task Description' };
      const result = await controller.create(createDto);
      expect(result).toEqual({ id: 1, title: 'Task 1', description: 'Task Description' });
      expect(taskService.createTask).toHaveBeenCalledWith(createDto.title, createDto.description);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const result = await controller.findAll({ user: { role: Role.ADMIN } }); // Mocking a request with user info
      expect(result).toEqual([{ id: 1, title: 'Task 1', description: 'Task Description' }]);
      expect(taskService.findAllTasks).toHaveBeenCalledWith({ role: Role.ADMIN });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const result = await controller.findOne({ user: { role: Role.ADMIN } }, 1);
      expect(result).toEqual({ id: 1, title: 'Task 1', description: 'Task Description' });
      expect(taskService.findTaskById).toHaveBeenCalledWith(1, { role: Role.ADMIN });
    });
  });

  describe('updateStatus', () => {
    it('should update the task status', async () => {
      const updateDto = { status: TaskStatus.COMPLETED };
      const result = await controller.updateStatus({ user: { role: Role.USER } }, 1, updateDto);
      expect(result).toEqual({ id: 1, status: TaskStatus.COMPLETED });
      expect(taskService.updateTaskStatus).toHaveBeenCalledWith(1, TaskStatus.COMPLETED, { role: Role.USER });
    });
  });

  describe('assign', () => {
    it('should assign a task to a user', async () => {
      const result = await controller.assign({ user: { role: Role.ADMIN } }, 1, 1);
      expect(result).toEqual({ id: 1, userId: 1, status: TaskStatus.PENDING });
      expect(taskService.assignTaskToUser).toHaveBeenCalledWith(1, 1, { role: Role.ADMIN });
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});
