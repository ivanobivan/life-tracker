import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { List } from './list.entity';
import { State } from '../enums/state.enum';
import { Exclude } from 'class-transformer';


@Entity()
export class Task {

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

    @ManyToOne<List>(() => List, (list) => list.tasks)
    list: List;

}
