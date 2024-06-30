import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const clone = req.clone({
        headers: req.headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoib2JpdmFuIiwiZW1haWwiOiJ0LnRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzE5NzAwOTU0LCJleHAiOjE3MTk3ODczNTR9.8EfxWuv8viMSpMLfZNbcNPqWaBR36LN-lkFayuYNYJo'),
    });
    return next(clone);
}
