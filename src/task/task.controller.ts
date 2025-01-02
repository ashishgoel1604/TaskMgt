import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody, ApiParam } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { Task, TaskStatus } from '../entities/task.entity';
import { UserAuthGuard } from '../guards/UserAuthGuard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../entities/user.entity';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN)
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    description: 'The task creation payload',
    type: Object,
    examples: {
      'application/json': {
        value: {
          title: 'Task 1',
          description: 'Describe task',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() body: { title: string; description: string; }) {
    return this.taskService.createTask(body.title, body.description);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks' })
  findAll(@Request() req: any): Promise<Task[]> {
    return this.taskService.findAllTasks(req.user);
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
  @ApiParam({ name: 'id', type: 'number', description: 'The task ID' })
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  findOne(@Request() req: any, @Param('id') id: number) {
    return this.taskService.findTaskById(id, req.user);
  }

  @Put(':id/status')
  @UseGuards(UserAuthGuard)
  @Roles(Role.USER)
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'The task ID' })
  @ApiOperation({ summary: 'Update task status' })
  @ApiBody({
    description: 'Update task status',
    type: Object,
    examples: {
      'application/json': {
        value: {
          status: 'Pending or In Progress or Completed'
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  updateStatus(@Request() req: any, @Param('id') id: number, @Body() body: { status: TaskStatus }): Promise<Task> {
    return this.taskService.updateTaskStatus(id, body.status, req.user);
  }

  @Put(':taskId/assign/:userId')
  @UseGuards(UserAuthGuard)
  @Roles(Role.ADMIN)
  @ApiHeader({
    name: 'token',
    description: 'Token to be passed in the headers',
    required: true,
    example: '<<token str>>',
  })
  @ApiParam({ name: 'taskId', type: 'string', description: 'ID of the task to be assigned' })  // Task ID URL parameter
  @ApiParam({ name: 'userId', type: 'string', description: 'ID of the user to assign the task to' })  // User ID URL parameter
  @ApiOperation({ summary: 'Assign task to a user' })
  @ApiResponse({ status: 200, description: 'Task assigned successfully' })
  assign(@Request() req: any, @Param('taskId') taskId: number, @Param('userId') userId: number) {
    return this.taskService.assignTaskToUser(taskId, userId, req.user);
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
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  delete(@Param('id') id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
