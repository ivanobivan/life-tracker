import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCreateModel, BaseModel, BaseUpdateModel, BaseUpdateOrderModel } from '../models/base.model';

@Injectable()
export abstract class BaseClient<T extends BaseModel, C extends BaseCreateModel, U extends BaseUpdateModel> {
    private readonly http = inject(HttpClient);
    protected abstract readonly uri: string;

    create(id: number, body: C): Observable<void> {
        return this.http.post<void>(`${this.uri}/${id}`, body);
    }

    findAll(id: number, isArchive: boolean): Observable<T[]> {
        return this.http.get<T[]>(`${this.uri}/${id}`, {
            params: {
                isArchive
            }
        })
    }

    find(id: number): Observable<T> {
        return this.http.get<T>(`${this.uri}/${id}`);
    }

    update(parentId: number, id: number, body: U): Observable<void> {
        return this.http.patch<void>(`${this.uri}/${parentId}/${id}`, body);
    }

    updateOrder(boardId: number, body: BaseUpdateOrderModel[]): Observable<void> {
        return this.http.patch<void>(`${this.uri}/order/${boardId}`, body);
    }

    remove(parentId: number, id: number): Observable<void> {
        return this.http.delete<void>(`${this.uri}/${parentId}/${id}`);
    }

    removeAll(parentId: number):Observable<void> {
        return this.http.delete<void>(`${this.uri}/${parentId}`);
    }

}
