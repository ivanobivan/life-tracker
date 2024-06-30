import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateListOrderDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    order: number;
}
