import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../database/entites/task.entity';
import { State } from '../database/enums/state.enum';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';

@Injectable()
export class TaskService {
    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) {
    }

    async create(listId: number, body: CreateTaskDto): Promise<void> {
        const newTask = this.taskRepository.create({
            name: body.name,
            description: body.description,
            order: body.order,
            state: State.Active,
            list: {
                id: listId,
            },
        });
        await this.taskRepository.save(newTask);
    }

    async findAll(listId: number, isArchive?: boolean): Promise<Task[]> {
        return await this.taskRepository.findBy({
            state: isArchive ? State.Archive : State.Active,
            list: {
                id: listId,
            }
        });
    }

    async findOne(listId: number, id: number): Promise<Task | null> {
        return await this.taskRepository.findOneBy({
            list: {
                id: listId,
            },
            id,
        })
    }

    async update(listId: number, id: number, body: UpdateTaskDto): Promise<void> {
        const task = await this.findOne(listId, id);
        if (!task) {
            throw new HttpException('Task does not exist', HttpStatus.BAD_REQUEST);
        }
        if (body.name) {
            task.name = body.name;
        }
        if (body.description) {
            task.description = body.description;
        }
        if (body.state) {
            task.state = body.state
        }
        if (body.order) {
            task.order = body.order;
        }
        await this.taskRepository.save(task);
    }

    async updateOrder(listId: number, list: UpdateTaskOrderDto[]): Promise<void> {
        for (const { id, order } of list) {
            const list = await this.findOne(listId, id);
            list.order = order;
            await this.taskRepository.save(list);
        }
    }

    async remove(listId: number, id: number): Promise<void> {
        const list = await this.findOne(listId, id);
        if (!list) {
            throw new HttpException('Task does not exist', HttpStatus.BAD_REQUEST);
        }
        await this.taskRepository.remove(list);
    }

    async removeAll(listId: number): Promise<void> {
        const lists = await this.findAll(listId);
        if (!lists.length) {
            throw new HttpException('Tasks does not exist', HttpStatus.BAD_REQUEST);
        }
        await this.taskRepository.remove(lists);
    }
}
