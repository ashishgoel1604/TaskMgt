import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { Task, TaskStatus } from '../entities/task.entity';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() body: { title: string; description: string; deadline: string; userId: number }) {
    return this.taskService.createTask(body.title, body.description, body.deadline, body.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks' })
  findAll(): Promise<Task[]> {
    return this.taskService.findAllTasks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  findOne(@Param('id') id: number){
    return this.taskService.findAllTasks();
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  updateStatus(@Param('id') id: number, @Body() body: { status: TaskStatus }): Promise<Task> {
    return this.taskService.updateTaskStatus(id, body.status);
  }

  @Put(':taskId/assign/:userId')
  @ApiOperation({ summary: 'Assign task to a user' })
  @ApiResponse({ status: 200, description: 'Task assigned successfully' })
  assign(@Param('taskId') taskId: number, @Param('userId') userId: number) {
    return this.taskService.assignTaskToUser(taskId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  delete(@Param('id') id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
