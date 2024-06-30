import { defer, finalize, Observable, Subject, tap } from 'rxjs';

const loadingMap = new Map<Subject<boolean>, number>();


export const prepare = <T> (callback: () => void): (source: Observable<T>) => Observable<T> => {
    return (source: Observable<T>): Observable<T> => defer(() => {
        callback();
        return source;
    })
}

export const loading = <T> (subject: Subject<boolean>): (source: Observable<T>) => Observable<T> => {
    return (source: Observable<T>): Observable<T> =>
        source.pipe(
            prepare(() => {
                if(!loadingMap.has(subject)) {
                    loadingMap.set(subject, 0);
                    subject.next(true);
                }
                loadingMap.set(subject, (loadingMap.get(subject) as number) + 1);
            }),
            finalize(() => {
                loadingMap.set(subject, (loadingMap.get(subject) as number) - 1);

                if(loadingMap.get(subject) === 0) {
                    loadingMap.delete(subject);
                    subject.next(false);
                }
            })
        )
}
