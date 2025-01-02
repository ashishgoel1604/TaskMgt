import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { Role } from '../entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private userSvc: UserService,
  ) { }

  createTask(title: string, description: string, userId: number): Promise<Task> {
    const task = this.taskRepository.create({ title, description, user: { id: userId } });
    return this.taskRepository.save(task);
  }

  findAllTasks(loggedInUser: any): Promise<Task[]> {
    if (loggedInUser.role == Role.ADMIN)
      return this.taskRepository.find({ relations: ['user'] });

    return this.taskRepository.find({
      where: {
        user: { id: loggedInUser.id }
      }
    })
  }

  async findTaskById(id: number, loggedInUser: any): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: { user: true } });
    if (task) {
      if (loggedInUser?.id !== task.user?.id) {
        throw new UnauthorizedException({ message: 'You are not allowed to perform this operation!' });
      }
      return task;
    }
    throw new BadRequestException({ message: 'Task not found!' });
  }

  async updateTaskStatus(id: number, status: TaskStatus, loggedInUser: any): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: { user: true } });
    if (task) {
      if (loggedInUser?.id !== task.user?.id) {
        throw new UnauthorizedException({ message: 'You are not allowed to perform this operation!' });
      }
      task.status = status;
      return this.taskRepository.save(task);
    }
    throw new BadRequestException({ message: 'Task not found!' });
  }

  async assignTaskToUser(taskId: number, userId: number, loggedInUser: any) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new BadRequestException({ message: 'Task not found!' });
    }
    const user = await this.userSvc.findUserById(userId, loggedInUser)
    if (!user) {
      throw new BadRequestException({ message: 'User not found!' });
    }
    if (task) {
      task.user = user;
      return this.taskRepository.save(task);
    }
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
