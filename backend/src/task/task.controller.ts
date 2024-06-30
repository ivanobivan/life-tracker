import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ParseIntPipe,
    Query, ParseBoolPipe
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Task } from '../database/entites/task.entity';
import { UpdateListOrderDto } from '../list/dto/update-list-order.dto';

@Controller({
    path: 'task',
    version: '1'
})
export class TaskController {
    constructor(private readonly taskService: TaskService) {
    }

    @Post(':listId')
    create(
        @Param('listId', ParseIntPipe) listId: number,
        @Body() createTaskDto: CreateTaskDto
    ): Promise<void> {
        return this.taskService.create(listId, createTaskDto);
    }

    @Get(':listId')
    @UseInterceptors(TransformInterceptor)
    findAll(
        @Param('listId', ParseIntPipe) listId: number,
        @Query('isArchive', ParseBoolPipe) isArchive?: boolean
    ): Promise<Task[]> {
        return this.taskService.findAll(listId, isArchive);
    }

    @Get(':listId/:id')
    @UseInterceptors(TransformInterceptor)
    findOne(
        @Param('listId', ParseIntPipe) listId: number,
        @Param('id', ParseIntPipe) id: number
    ): Promise<Task> {
        return this.taskService.findOne(listId, id);
    }

    @Patch('order/:listId')
    updateOrder(
        @Param('listId', ParseIntPipe) boardId: number,
        @Body() updateListsOrderDto: UpdateListOrderDto[]
    ): Promise<void> {
        return this.taskService.updateOrder(boardId, updateListsOrderDto);
    }

    @Patch(':listId/:id')
    update(
        @Param('listId', ParseIntPipe) listId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto
    ): Promise<void> {
        return this.taskService.update(listId, id, updateTaskDto);
    }

    @Delete(':listId')
    removeAll(@Param('listId', ParseIntPipe) listId: number) {
        return this.taskService.removeAll(listId);
    }

    @Delete(':listId/:id')
    remove(
        @Param('listId', ParseIntPipe) listId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.taskService.remove(listId, id);
    }
}
