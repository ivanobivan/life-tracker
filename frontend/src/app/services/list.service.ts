import { inject, Injectable } from '@angular/core';
import { ListClient } from '../clients/list.client';
import { loadingList, LoadingListName } from '../consts/loading.const';
import { BehaviorSubject, combineLatest, filter, map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { List, ListCreate, ListUpdate } from '../models/list.model';
import { BoardService } from './board.service';
import { loading } from '../common/operators/loading.operator';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { TuiDialogService } from '@taiga-ui/core';
import { AppService } from './app.service';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { State } from '../enums/state.enum';
import { BaseUpdateOrderModel } from '../models/base.model';


@Injectable({ providedIn: 'root' })
export class ListService {
    private readonly client = inject(ListClient);
    private readonly appService = inject(AppService);
    private readonly boardService = inject(BoardService);
    private readonly dialog = inject(TuiDialogService);
    private readonly loadingMap = new Map<LoadingListName, BehaviorSubject<boolean>>(
        loadingList.map((e) => [e, new BehaviorSubject(false)]),
    )
    private readonly createMode$ = new BehaviorSubject(false);
    private readonly updateLists$ = new Subject<void>();
    private readonly lists$ = combineLatest([
        this.boardService.getActiveBoardId(),
        this.updateLists$.pipe(startWith(null)),
    ]).pipe(
        tap(() => this.createMode$.next(false)),
        switchMap(([id]) => this.findAll(id))
    )

    getLoading(name: LoadingListName): Subject<boolean> {
        return this.loadingMap.get(name) as Subject<boolean>;
    }

    getLists(): Observable<List[]> {
        return this.lists$;
    }

    getListCreateMode(): Observable<boolean> {
        return this.createMode$;
    }

    setListCreateMode(isCreate: boolean): void {
        this.createMode$.next(isCreate);
    }

    findAll(boardId: number): Observable<List[]> {
        return this.appService.isArchiveMode().pipe(
            switchMap((isArchiveMode) => this.client.findAll(boardId, isArchiveMode).pipe(
                loading(this.getLoading('find-all'))
            )),
            map((lists) => lists.sort((a, b) => a.order - b.order))
        );
    }

    create(boardId: number, body: ListCreate): void {
        this.client.create(boardId, body).pipe(
            loading(this.getLoading('create')),
            tap(() => this.updateLists$.next()),
        ).subscribe();
    }

    update(list: List): void {
        this.dialog.open<ListUpdate>(new PolymorpheusComponent(EditDialogComponent), {
            label: 'Редактирование',
            data: {
                mode: 'update',
                board: list
            }
        }).pipe(
            filter(Boolean),
            switchMap((updateBody) => this.boardService.getActiveBoardId().pipe(map((boardId) => ({
                boardId,
                updateBody
            })))),
            switchMap(({ boardId, updateBody }) => this.client.update(boardId, list.id, updateBody).pipe(
                loading(this.getLoading('update')),
            )),
            tap(() => this.updateLists$.next()),
        ).subscribe()
    }

    remove(id: number): void {
        this.dialog.open(TUI_PROMPT, {
            label: 'Удалить список?',
            size: 's',
            data: {
                content: 'Внимание! При удалении списка вы удалите все задания, привязанные к этому списку, без возможности восстановления',
                no: 'Нет',
                yes: 'Да',
            }
        }).pipe(
            filter(Boolean),
            switchMap(() => this.boardService.getActiveBoardId()),
            switchMap((boardId) => this.client.remove(boardId, id).pipe(
                loading(this.getLoading('remove')),
            )),
            tap(() => this.updateLists$.next()),
        ).subscribe();
    }

    archive(list: List): void {
        this.dialog.open(TUI_PROMPT, {
            label: 'Архивировать список?',
            size: 's',
            data: {
                content: 'При архивировании все задачи перейдут в статус архивные, но вы сможете восстановить их в любое время',
                no: 'Нет',
                yes: 'Да',
            }
        }).pipe(
            filter(Boolean),
            switchMap(() => this.boardService.getActiveBoardId()),
            switchMap((boardId) => this.client.update(boardId, list.id, {
                order: list.order,
                description: list.description,
                name: list.name,
                state: State.Archive,
            }).pipe(
                loading(this.getLoading('update'))
            )),
            tap(() => this.updateLists$.next()),
        ).subscribe();
    }

    updateOrder(map: Map<number, number>, lists: List[] | null): void {
        const list: BaseUpdateOrderModel[] = [];
        map.forEach((val, key) => {
            const board = lists?.[key];
            if (board) {
                list.push({
                    id: board.id,
                    order: val,
                });
            }
        })
        if (list.length) {
            this.boardService.getActiveBoardId().pipe(
                switchMap((boardId) => this.client.updateOrder(boardId, list).pipe(
                    loading(this.getLoading('update-order'))
                )),
            ).subscribe();
        }

    }

}
