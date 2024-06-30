import { Board } from '../../database/entites/board.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto implements Pick<Board, 'name' | 'description' | 'order'>{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    order: number;
}
