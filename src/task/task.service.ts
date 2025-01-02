import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) { }

  createTask(title: string, description: string, deadline: string, userId: number): Promise<Task> {
    const task = this.taskRepository.create({ title, description, deadline, user: { id: userId } });
    return this.taskRepository.save(task);
  }

  findAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['user'] });
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (task) {
      task.status = status;
      return this.taskRepository.save(task);
    }
    return null;
  }

  async assignTaskToUser(taskId: number, userId: number) {
    // const task = await this.taskRepository.findOne({ where: { id: taskId } });
    // if (task) {
    //   task.user = { id: userId };
    //   return this.taskRepository.save(task);
    // }
    // return null;
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
