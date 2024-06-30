import { Task } from '../../database/entites/task.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto implements Pick<Task, 'name' | 'description' | 'order'>{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    order: number;
}
