import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { TodoStatus } from 'src/entity/todo.entity';
import { UserEntity } from 'src/entity/user.entity';
import { TodoStatusValidationPipe } from 'src/pipes/TodoStatusValidation.pipe';
import { TodoService } from './todo.service';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getTodos(@User() user: UserEntity) {
    return this.todoService.all(user);
  }

  @Post()
  async createTodo(@Body() data: CreateTodoDto, @User() user: UserEntity) {
    return this.todoService.create({ ...data }, user);
  }

  @Patch(':id')
  async updateTodo(
    @Body('status', TodoStatusValidationPipe) status: TodoStatus,
    @Param('id') id: number,
    @User() user: UserEntity,
  ) {
    return this.todoService.update(id, status, user);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number, @User() user: UserEntity) {
    return this.todoService.delete(id, user);
  }
}
