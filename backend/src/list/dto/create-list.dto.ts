import { List } from '../../database/entites/list.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateListDto implements Pick<List, 'name' | 'description' | 'order'> {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    order: number;

}
