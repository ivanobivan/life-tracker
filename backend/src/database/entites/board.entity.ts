import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { User } from './user.entity';
import { List } from './list.entity';
import { State } from '../enums/state.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class Board {

    @PrimaryGeneratedColumn()
    id: number

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

    @ManyToOne<User>(() => User, (user) => user.boards)
    user: User;

    @OneToMany<List>(() => List, (list) => list.board)
    lists: List[];
}
