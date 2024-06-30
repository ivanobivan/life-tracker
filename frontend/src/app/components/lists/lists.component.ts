import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../../models/list.model';
import { TuiInputInlineModule, TuiInputModule, TuiIslandModule, TuiTilesModule } from '@taiga-ui/kit';
import {
    TuiButtonModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiScrollbarModule,
    TuiSvgModule,
    TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { ListService } from '../../services/list.service';
import { Board } from '../../models/board.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { TasksComponent } from '../tasks/tasks.component';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'tracker-lists',
    standalone: true,
    imports: [CommonModule, TuiIslandModule, TuiSvgModule, TuiButtonModule, TuiInputInlineModule, ReactiveFormsModule, TuiTextfieldControllerModule, TuiInputModule, TuiTilesModule, TuiScrollbarModule, TuiDataListModule, TuiHostedDropdownModule, TasksComponent],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.less',
})
export class ListsComponent {

    @Input({ required: true })
    lists!: List[] | null;

    @Input({ required: true })
    activeBoard!: Board;

    private readonly listService = inject(ListService);
    private readonly taskService = inject(TaskService);
    private readonly fb = inject(FormBuilder);

    readonly createListMode$ = this.listService.getListCreateMode();
    readonly tasks$ = this.taskService.getTasks().subscribe();

    readonly nameControl = this.fb.nonNullable.control<string>('', {
        validators: [Validators.required]
    });

    listOrder = new Map();
    dropDownOpen: boolean[] = [];

    get createOffset(): number {
        return (this.lists?.length || 0) * 16 + ((this.lists?.length || 0) + 1);
    }

    toggleCreateMode(enable: boolean): void {
        this.listService.setListCreateMode(enable);
    }

    createList(initialOrder = 0): void {
        tuiMarkControlAsTouchedAndValidate(this.nameControl);
        if (this.nameControl.invalid) {
            return;
        }
        this.listService.create(this.activeBoard.id, {
            order: initialOrder,
            name: this.nameControl.value,
        });
    }

    showEditListModal(list: List): void {
        this.listService.update(list);
    }

    showArchiveListModal(list: List): void {
        this.listService.archive(list);
    }

    showRemoveListModal(id: number): void {
        this.listService.remove(id);
    }

    listOrderChange(map: Map<number, number>): void {
        this.listService.updateOrder(map, this.lists);
    }
}
