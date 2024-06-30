import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Request,
    UseInterceptors
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { List } from '../database/entites/list.entity';
import { UpdateListOrderDto } from './dto/update-list-order.dto';

@Controller({
    path: 'list',
    version: '1',
})
export class ListController {
    constructor(private readonly listService: ListService) {
    }

    @Post(':boardId')
    create(
        @Param('boardId', ParseIntPipe) boardId: number,
        @Body() createListDto: CreateListDto
    ): Promise<void> {
        return this.listService.create(boardId, createListDto);
    }

    @Get(':boardId')
    @UseInterceptors(TransformInterceptor)
    findAll(
        @Param('boardId', ParseIntPipe) boardId: number,
        @Query('isArchive', ParseBoolPipe) isArchive?: boolean
    ): Promise<List[]> {
        return this.listService.findAll(boardId, isArchive);
    }

    @Get(':boardId/:id')
    @UseInterceptors(TransformInterceptor)
    findOne(
        @Param('boardId', ParseIntPipe) boardId: number,
        @Param('id', ParseIntPipe) id: number
    ): Promise<List> {
        return this.listService.findOne(boardId, id);
    }

    @Patch('order/:boardId')
    updateOrder(
        @Param('boardId', ParseIntPipe) boardId: number,
        @Body() updateListsOrderDto: UpdateListOrderDto[]
    ): Promise<void> {
        return this.listService.updateOrder(boardId, updateListsOrderDto);
    }

    @Patch(':boardId/:id')
    update(
        @Param('boardId', ParseIntPipe) boardId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateListDto
    ) {
        return this.listService.update(boardId, id, body);
    }

    @Delete(':boardId')
    removeAll(@Param('boardId', ParseIntPipe) boardId: number) {
        return this.listService.removeAll(boardId);
    }

    @Delete(':boardId/:id')
    remove(
        @Param('boardId', ParseIntPipe) boardId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.listService.remove(boardId, id);
    }
}
