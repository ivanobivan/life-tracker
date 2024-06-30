import { Board } from '../../database/entites/board.entity';
import { State } from '../../database/enums/state.enum';
import { IsOptional } from 'class-validator';

export class UpdateBoardDto implements Pick<Board, 'state' | 'order' | 'description' | 'name'>{
    @IsOptional()
    description: string;

    @IsOptional()
    name: string;

    @IsOptional()
    order: number;

    @IsOptional()
    state: State;
}
