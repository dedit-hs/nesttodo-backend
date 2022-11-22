import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TodoEntity } from 'src/entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity]), AuthModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
