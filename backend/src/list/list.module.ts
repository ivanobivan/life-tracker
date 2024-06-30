import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from '../database/entites/list.entity';

@Module({
    imports: [TypeOrmModule.forFeature([List])],
    controllers: [ListController],
    providers: [ListService],
    exports: [ListService]
})
export class ListModule {
}
