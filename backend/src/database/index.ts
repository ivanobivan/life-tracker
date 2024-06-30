import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Board } from './entites/board.entity';
import { List } from './entites/list.entity';
import { Task } from './entites/task.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "life_tracker",
            synchronize: true,
            logging: false,
            entities: [User, Board, List, Task],
            migrations: [],
            subscribers: [],
        }),
    ],
    exports: [TypeOrmModule]
})
export class DatabaseModule {
}
