import {
    Body,
    Controller,
    Delete,
    Get,
    Param, ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post, Query,
    Request,
    UseInterceptors
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from '../database/entites/board.entity';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { UpdateBoardOrderDto } from './dto/update-board-order.dto';

@Controller({
    path: 'board',
    version: '1',
})
export class BoardController {
    constructor(private readonly boardService: BoardService) {
    }

    @Post()
    create(@Request() req, @Body() createBoardDto: CreateBoardDto): Promise<void> {
        return this.boardService.create(createBoardDto, req.user.sub);
    }

    @Get()
    @UseInterceptors(TransformInterceptor)
    findAll(@Request() req, @Query('isArchive', ParseBoolPipe) isArchive?: boolean): Promise<Board[]> {
        return this.boardService.findAll(req.user.sub, isArchive);
    }

    @Get(':id')
    @UseInterceptors(TransformInterceptor)
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Board | null> {
        return this.boardService.findOne(req.user.sub, id);
    }

    @Patch('order')
    updateOrder(@Request() req, @Body() updateBoardOrderDto: UpdateBoardOrderDto[]): Promise<void> {
        return this.boardService.updateOrder(req.user.sub, updateBoardOrderDto);
    }

    @Patch(':id')
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateBoardDto: UpdateBoardDto): Promise<void> {
        return this.boardService.update(req.user.sub, id, updateBoardDto);
    }

    @Delete()
    removeAll(@Request() req) {
        return this.boardService.removeAll(req.user.sub);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.boardService.remove(req.user.sub, id);
    }
}
