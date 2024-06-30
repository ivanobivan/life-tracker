import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { Board } from './board.entity';
import { Task } from './task.entity';
import { State } from '../enums/state.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class List {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'int',
    })
    order: number;

    @Column({
        type: 'int',
    })
    state: State;

    @CreateDateColumn()
    @Exclude()
    created: Date;

    @UpdateDateColumn()
    @Exclude()
    updated: Date

    @ManyToOne<Board>(() => Board, (board) => board.lists)
    board: Board;

    @OneToMany<Task>(() => Task, (task) => task.list)
    tasks: Task[];
}
