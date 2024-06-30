import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BoardsComponent } from './components/boards/boards.component';
import { TuiLoaderModule, TuiRootModule, TuiSvgModule } from '@taiga-ui/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { BoardService } from './services/board.service';
import { combineLatest, map } from 'rxjs';
import { ListService } from './services/list.service';
import { TaskService } from './services/task.service';
import { ListsComponent } from './components/lists/lists.component';

@Component({
    standalone: true,
    imports: [
        BoardsComponent,
        TuiRootModule,
        AsyncPipe,
        NgIf,
        TuiLoaderModule,
        ListsComponent,
        TuiSvgModule,
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

    private readonly boardService = inject(BoardService);
    private readonly listService = inject(ListService);
    private readonly taskService = inject(TaskService);

    readonly loading$ = combineLatest([
        this.boardService.getLoading('create'),
        this.boardService.getLoading('update'),
        this.boardService.getLoading('remove'),
        this.boardService.getLoading('update-order'),
        this.listService.getLoading('create'),
        this.listService.getLoading('update'),
        this.listService.getLoading('remove'),
        this.listService.getLoading('update-order'),
    ]).pipe(map((list) => list.some(Boolean)));


    readonly boards$ = this.boardService.getBoards();
    readonly activeBoard$ = this.boardService.getActiveBoard();
    readonly lists$ = this.listService.getLists();

    ngOnInit(): void {
        this.boardService.loadBoards();
        /*this.boardService.findAll().pipe(
            switchMap((boards) => from(boards)),
            mergeMap((board) =>
                this.listService.findAll(board.id).pipe(
                    map((lists) => ({ board, lists }))
                )
            ),
            switchMap(({ board, lists }) => {
                if (lists.length) {
                    return from(lists).pipe(map((list) => ({ board, list })))
                } else {
                    return of({ board, list: null });
                }
            }),
            mergeMap(({ board, list }) => {
                if (list) {
                    return this.taskService.findAll(list.id).pipe(
                        map((tasks) => ({ board, list, tasks }))
                    )
                } else {
                    return of({ board, list: [], tasks: [] });
                }
            }),
        ).subscribe();*/
    }

}
