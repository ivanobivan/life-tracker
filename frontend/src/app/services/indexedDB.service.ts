import { inject, Injectable } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';

@Injectable()
export class IndexedDBService {
    private readonly window =  inject(WINDOW);
    private readonly db?: IDBOpenDBRequest;

}
