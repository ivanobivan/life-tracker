import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { BoardModule } from './board/board.module';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        AuthModule,
        BoardModule,
        ListModule,
        TaskModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {
}
