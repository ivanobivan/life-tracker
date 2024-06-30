import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseClient } from './base.client';
import { List, ListCreate, ListUpdate } from '../models/list.model';

@Injectable({providedIn: 'root'})
export class ListClient extends BaseClient<List, ListCreate, ListUpdate> {
    protected readonly uri = `${environment.baseUri}/api/v1/list`;
}
