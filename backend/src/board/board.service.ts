import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../database/entites/board.entity';
import { Repository } from 'typeorm';
import { State } from '../database/enums/state.enum';
import { UpdateBoardOrderDto } from './dto/update-board-order.dto';

@Injectable()
export class BoardService {
    constructor(@InjectRepository(Board) private boardRepository: Repository<Board>) {
    }

    async create(body: CreateBoardDto, userId: number): Promise<void> {
        const newBoard = this.boardRepository.create({
            name: body.name,
            description: body.description,
            order: body.order,
            state: State.Active,
            user: {
                id: userId,
            },
        });
        await this.boardRepository.save(newBoard);
    }

    async findAll(userId: number, isArchive?: boolean): Promise<Board[]> {
        return await this.boardRepository.findBy({
            state: isArchive ? State.Archive : State.Active,
            user: {
                id: userId,
            },
        });
    }

    async findOne(userId: number, id: number): Promise<Board | null> {
        return await this.boardRepository.findOneBy({
            user: {
                id: userId,
            },
            id,
        })
    }

    async update(userId: number, id: number, body: UpdateBoardDto): Promise<void> {
        const board = await this.findOne(userId, id);
        if (!board) {
            throw new HttpException('Board does not exist', HttpStatus.BAD_REQUEST)
        }
        if (body.name) {
            board.name = body.name;
        }
        if (body.description) {
            board.description = body.description;
        }
        if (body.state) {
            board.state = body.state
        }
        if (body.order) {
            board.order = body.order;
        }
        await this.boardRepository.save(board);
    }

    async updateOrder(userId: number, list: UpdateBoardOrderDto[]): Promise<void> {
        for (const { id, order } of list) {
            const board = await this.findOne(userId, id);
            board.order = order;
            await this.boardRepository.save(board);
        }
    }

    async remove(userId: number, id: number): Promise<void> {
        const board = await this.findOne(userId, id);
        if (!board) {
            throw new HttpException('Board does not exist', HttpStatus.BAD_REQUEST);
        }
        await this.boardRepository.remove(board);
    }

    async removeAll(userId: number): Promise<void> {
        const boards = await this.findAll(userId);
        if (!boards.length) {
            throw new HttpException('Boards does not exist', HttpStatus.BAD_REQUEST);
        }
        await this.boardRepository.remove(boards);
    }
}
