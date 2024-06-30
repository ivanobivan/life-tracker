import { Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { Task } from '../../models/task.model';

@Component({
    selector: 'tracker-tasks',
    standalone: true,
    imports: [
        TuiIslandModule
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.less',
})
export class TasksComponent {

    @Input({required: true})
    tasks!: Task[];
}
