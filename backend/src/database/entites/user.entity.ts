import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Board } from './board.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        nullable: true,
    })
    name: string;

    @Column()
    password: string;

    @Column({
        unique: true
    })
    email: string;


    @Column({
        type: 'boolean',
    })
    activated: boolean;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date

    @OneToMany<Board>(() => Board, (board) => board.user)
    boards: Board[];

}
