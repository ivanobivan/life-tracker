import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBoardOrderDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    order: number;
}
