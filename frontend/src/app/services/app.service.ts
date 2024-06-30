import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AppService {

    /** archive mode for all application */
    private readonly isArchiveMode$ = new BehaviorSubject(false);

    isArchiveMode(): Observable<boolean> {
        return this.isArchiveMode$;
    }

    setArchiveMode(mode: boolean): void {
        this.isArchiveMode$.next(mode);
    }
}
