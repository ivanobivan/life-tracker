import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTaskOrderDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    order: number;
}
