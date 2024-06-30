import { inject, Injectable } from '@angular/core';
import { TaskClient } from '../clients/task.client';
import { loadingTask, LoadingTaskName } from '../consts/loading.const';
import {
    BehaviorSubject, forkJoin,
    from,
    map,
    mergeMap,
    Observable,
    of,
    scan,
    Subject,
    switchMap, take,
    tap,
    toArray,
    zip
} from 'rxjs';
import { AppService } from './app.service';
import { ListService } from './list.service';
import { loading } from '../common/operators/loading.operator';
import { Task } from '../models/task.model';


@Injectable({ providedIn: 'root' })
export class TaskService {
    private readonly client = inject(TaskClient);
    private readonly appService = inject(AppService);
    private readonly listService = inject(ListService);
    private readonly loadingMap = new Map<LoadingTaskName, BehaviorSubject<boolean>>(
        loadingTask.map((e) => [e, new BehaviorSubject(false)]),
    )

    private readonly tasks$ = this.listService.getLists().pipe(
        switchMap(lists => from(lists)),
        mergeMap((list) => {
            debugger
            return zip([this.findAll(list.id), of(list.id)])
        }),
        scan((map, [tasks, listId]) => {
            map.set(listId, tasks);
            return map;
        }, new Map()),
        take(1),
        tap((_res) => {
            debugger
        })
    );

    getLoading(name: LoadingTaskName): Subject<boolean> {
        return this.loadingMap.get(name) as Subject<boolean>;
    }

    getTasks(): Observable<[Task[], number][]> {
        return this.tasks$ as any;
    }

    findAll(listId: number): Observable<Task[]> {
        return this.appService.isArchiveMode().pipe(
            switchMap((isArchiveMode) => this.client.findAll(listId, isArchiveMode).pipe(
                loading(this.getLoading('find-all'))
            )),
            map((lists) => lists.sort((a, b) => a.order - b.order))
        );
    }
}
