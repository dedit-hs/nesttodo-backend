import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TodoStatus } from 'src/entity/todo.entity';

export class TodoStatusValidationPipe implements PipeTransform {
  readonly allowedStatus: TodoStatus[] = [
    TodoStatus.OPEN,
    TodoStatus.WIP,
    TodoStatus.COMPLETED,
  ];

  transform(value: any, metadata: ArgumentMetadata): any {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any): boolean {
    const index: number = this.allowedStatus.indexOf(status);
    return index != -1;
  }
}
