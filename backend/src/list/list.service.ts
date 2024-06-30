import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../database/entites/list.entity';
import { State } from '../database/enums/state.enum';
import { UpdateBoardOrderDto } from '../board/dto/update-board-order.dto';

@Injectable()
export class ListService {
    constructor(@InjectRepository(List) private listRepository: Repository<List>) {
    }

    async create(boardId: number, body: CreateListDto): Promise<void> {
        const newList = this.listRepository.create({
            name: body.name,
            description: body.description,
            order: body.order,
            state: State.Active,
            board: {
                id: boardId,
            },
        });
        await this.listRepository.save(newList);
    }

    async findAll(boardId: number, isArchive?: boolean): Promise<List[]> {
        return await this.listRepository.findBy({
            state: isArchive ? State.Archive : State.Active,
            board: {
                id: boardId,
            }
        });
    }

    async findOne(boardId: number, id: number): Promise<List | null> {
        return await this.listRepository.findOneBy({
            board: {
                id: boardId,
            },
            id,
        })
    }

    async update(boardId: number, id: number, body: UpdateListDto): Promise<void> {
        const list = await this.findOne(boardId, id);
        if (!list) {
            throw new HttpException('List does not exist', HttpStatus.BAD_REQUEST);
        }
        if (body.name) {
            list.name = body.name;
        }
        if (body.description) {
            list.description = body.description;
        }
        if (body.state) {
            list.state = body.state
        }
        if (body.order) {
            list.order = body.order;
        }
        await this.listRepository.save(list);
    }

    async updateOrder(boardId: number, list: UpdateBoardOrderDto[]): Promise<void> {
        for (const { id, order } of list) {
            const list = await this.findOne(boardId, id);
            list.order = order;
            await this.listRepository.save(list);
        }
    }

    async remove(boardId: number, id: number): Promise<void> {
        const list = await this.findOne(boardId, id);
        if (!list) {
            throw new HttpException('List does not exist', HttpStatus.BAD_REQUEST);
        }
        await this.listRepository.remove(list);
    }

    async removeAll(boardId: number): Promise<void> {
        const lists = await this.findAll(boardId);
        if (!lists.length) {
            throw new HttpException('Lists does not exist', HttpStatus.BAD_REQUEST);
        }
        await this.listRepository.remove(lists);
    }
}
