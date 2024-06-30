import { inject, Injectable } from '@angular/core';
import { BoardClient } from '../clients/board.client';
import { loadingBoard, LoadingBoardName } from '../consts/loading.const';
import { BehaviorSubject, filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { Board, BoardCreate, BoardUpdate } from '../models/board.model';
import { loading } from '../common/operators/loading.operator';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { State } from '../enums/state.enum';
import { BaseUpdateOrderModel } from '../models/base.model';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { LocalStorageKey } from '../enums/storage-key.enum';
import { AppService } from './app.service';

@Injectable({ providedIn: 'root' })
export class BoardService {
    protected readonly client = inject(BoardClient);
    private readonly dialog = inject(TuiDialogService);
    private readonly appService = inject(AppService);
    private readonly localStorageRef = inject(LOCAL_STORAGE);
    private readonly boards$ = new BehaviorSubject<Board[] | null>(null);
    private readonly activeBoardId = new BehaviorSubject<number>(-1);
    private readonly activeBoard$ = this.activeBoardId.pipe(
        filter((id) => id !== null && id >= 0),
        tap((id) => {
            this.localStorageRef.setItem(LocalStorageKey.ActiveBoard, String(id));
        }),
        switchMap((id) => this.boards$.pipe(map((boards) => ({ boards, id })))),
        map(({ boards, id }) => boards?.find(board => board.id === id) || null),
    );

    private readonly loadingMap = new Map<LoadingBoardName, BehaviorSubject<boolean>>(
        loadingBoard.map((e) => [e, new BehaviorSubject(false)]),
    )

    constructor() {
        const activeBoardId = this.localStorageRef.getItem(LocalStorageKey.ActiveBoard);
        if (activeBoardId) {
            this.activeBoardId.next(+activeBoardId);
        }
    }

    getLoading(name: LoadingBoardName): Subject<boolean> {
        return this.loadingMap.get(name) as Subject<boolean>;
    }

    getBoards(): Observable<Board[] | null> {
        return this.boards$;
    }

    getActiveBoardId(): Observable<number> {
        return this.activeBoardId.pipe(
            filter((id) => id >= 0),
        );
    }

    getActiveBoard(): Observable<Board | null> {
        return this.activeBoard$;
    }

    setActiveBoardId(id: number): void {
        this.activeBoardId.next(id);
    }

    loadBoards(): void {
        this.findAll().subscribe();
    }

    findAll(): Observable<Board[]> {
        return this.appService.isArchiveMode().pipe(
            switchMap((isArchiveMode) => this.client.findAll(isArchiveMode).pipe(
                loading(this.getLoading('find-all'))
            )),
            tap((boards) => {
                boards.sort((a, b) => a.order - b.order);
                this.boards$.next(boards);
            }),
        );
    }

    create(initialOrder: number): void {
        this.dialog.open<BoardCreate>(new PolymorpheusComponent(EditDialogComponent), {
            label: 'Новая доска',
            data: {
                mode: 'create',
                initialOrder,
            },
        }).pipe(
            filter(Boolean),
            switchMap((body) => this.client.create(body).pipe(
                loading(this.getLoading('create'))
            )),
            switchMap(() => this.findAll())
        ).subscribe();
    }

    update(board: Board): void {
        this.dialog.open<BoardUpdate>(new PolymorpheusComponent(EditDialogComponent), {
            label: 'Редактирование',
            data: {
                mode: 'update',
                board
            }
        }).pipe(
            filter(Boolean),
            switchMap((body) => this.client.update(board.id, body).pipe(
                loading(this.getLoading('update'))
            )),
            switchMap(() => this.findAll())
        ).subscribe()
    }


    remove(id: number): void {
        this.dialog.open(TUI_PROMPT, {
            label: 'Удалить доску?',
            size: 's',
            data: {
                content: 'Внимание! При удалении доски вы удалить все списки и задания, привязанные к этой доске, без возможности восстановления',
                no: 'Нет',
                yes: 'Да',
            }
        }).pipe(
            filter(Boolean),
            switchMap(() => this.client.remove(id).pipe(
                loading(this.getLoading('remove'))
            )),
            switchMap(() => this.findAll())
        ).subscribe();
    }

    archive(board: Board): void {
        this.dialog.open(TUI_PROMPT, {
            label: 'Архивировать доску?',
            size: 's',
            data: {
                content: 'При архивировании все списки и задачи перейдут в статус архивные, но вы сможете восстановить их в любое время',
                no: 'Нет',
                yes: 'Да',
            }
        }).pipe(
            filter(Boolean),
            switchMap(() => this.client.update(board.id, {
                order: board.order,
                description: board.description,
                name: board.name,
                state: State.Archive,
            }).pipe(
                loading(this.getLoading('update'))
            )),
            switchMap(() => this.findAll())
        ).subscribe();
    }

    updateOrder(map: Map<number, number>, boards: Board[] | null): void {
        const list: BaseUpdateOrderModel[] = [];
        map.forEach((val, key) => {
            const board = boards?.[key];
            if (board) {
                list.push({
                    id: board.id,
                    order: val,
                });
            }
        })
        if (list.length) {
            this.client.updateOrder(list).pipe(
                loading(this.getLoading('update-order'))
            ).subscribe();
        }

    }

}
