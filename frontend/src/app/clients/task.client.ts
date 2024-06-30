import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseClient } from './base.client';
import { Task, TaskCreate, TaskUpdate } from '../models/task.model';

@Injectable({providedIn: 'root'})
export class TaskClient extends BaseClient<Task, TaskCreate, TaskUpdate> {
    protected readonly uri = `${environment.baseUri}/api/v1/task`;
}
