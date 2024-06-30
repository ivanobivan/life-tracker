import { Board } from '../../database/entites/board.entity';
import { IsOptional } from 'class-validator';
import { State } from '../../database/enums/state.enum';

export class UpdateListDto implements Pick<Board, 'state' | 'order' | 'description' | 'name'>{

    @IsOptional()
    description: string;

    @IsOptional()
    name: string;

    @IsOptional()
    order: number;

    @IsOptional()
    state: State;

}
