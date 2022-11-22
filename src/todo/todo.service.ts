import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { TodoEntity, TodoStatus } from 'src/entity/todo.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async all(user: UserEntity) {
    const query = this.todoRepository.createQueryBuilder('todo');
    query.where(`todo.userId = :userId`, { userId: user.id });

    try {
      return await query.getMany();
    } catch (error) {
      throw new NotFoundException('no todo found.');
    }
  }

  async create(createTodoDto: CreateTodoDto, user: UserEntity) {
    const todo = new TodoEntity();
    const { title, description } = createTodoDto;
    todo.title = title;
    todo.description = description;
    todo.status = TodoStatus.OPEN;
    todo.userId = user.id;

    this.todoRepository.create(todo);
    return await this.todoRepository.save(todo);
  }

  async update(
    id: number,
    status: TodoStatus,
    user: UserEntity,
  ): Promise<TodoEntity> {
    try {
      await this.todoRepository.update({ id, userId: user.id }, { status });
      return this.todoRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async delete(id: number, user: UserEntity): Promise<void> {
    try {
      const deleted = await this.todoRepository.delete({ id, userId: user.id });

      if (deleted.affected === 0) {
        throw new NotFoundException('todo not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
