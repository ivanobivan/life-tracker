import { Task } from '../../database/entites/task.entity';
import { IsOptional } from 'class-validator';
import { State } from '../../database/enums/state.enum';

export class UpdateTaskDto implements Pick<Task, 'state' | 'order' | 'description' | 'name'>{
    @IsOptional()
    description: string;

    @IsOptional()
    name: string;

    @IsOptional()
    order: number;

    @IsOptional()
    state: State;
}
