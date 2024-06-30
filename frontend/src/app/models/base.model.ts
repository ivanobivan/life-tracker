import { State } from '../enums/state.enum';

export interface BaseModel {
    id: number;
    name: string;
    description?: string;
    order: number;
    state: State;
}

export interface BaseCreateModel {
    name: string;
    description?: string | null;
    order: number;
}

export interface BaseUpdateModel extends BaseCreateModel {
    state: State;
}

export interface BaseUpdateOrderModel {
    id: number;
    order: number;
}
