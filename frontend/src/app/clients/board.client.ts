import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Board, BoardCreate, BoardUpdate } from '../models/board.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUpdateOrderModel } from '../models/base.model';

@Injectable({ providedIn: 'root' })
export class BoardClient {
    private readonly http = inject(HttpClient);
    private readonly uri = `${environment.baseUri}/api/v1/board`;

    create(body: BoardCreate): Observable<void> {
        return this.http.post<void>(this.uri, body);
    }

    findAll(isArchive: boolean): Observable<Board[]> {
        return this.http.get<Board[]>(this.uri, {
            params: {
                isArchive
            }
        });
    }

    find(id: number): Observable<Board> {
        return this.http.get<Board>(`${this.uri}/${id}`);
    }

    update(id: number, body: BoardUpdate): Observable<void> {
        return this.http.patch<void>(`${this.uri}/${id}`, body);
    }

    updateOrder(body: BaseUpdateOrderModel[]): Observable<void> {
        return this.http.patch<void>(`${this.uri}/order`, body);
    }

    remove(id: number): Observable<void> {
        return this.http.delete<void>(`${this.uri}/${id}`);
    }

    removeAll(): Observable<void> {
        return this.http.delete<void>(this.uri);
    }

}
