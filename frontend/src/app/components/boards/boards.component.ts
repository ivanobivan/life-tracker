import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Board } from '../../models/board.model';
import { TuiIslandModule, TuiTilesModule } from '@taiga-ui/kit';
import {
    TuiButtonModule,
    TuiDataListModule,
    TuiHintModule,
    TuiHostedDropdownModule,
    TuiSvgModule
} from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import { BoardService } from '../../services/board.service';

@Component({
    selector: 'tracker-boards',
    standalone: true,
    imports: [
        TuiIslandModule,
        TuiButtonModule,
        AsyncPipe,
        TuiTilesModule,
        TuiSvgModule,
        TuiHintModule,
        TuiHostedDropdownModule,
        TuiDataListModule,
    ],
    templateUrl: './boards.component.html',
    styleUrl: './boards.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsComponent {

    @Input({ required: true })
    boards!: Board[] | null;

    private readonly boardService = inject(BoardService);

    readonly dropDownOpen: boolean[] = [];
    orderMap = new Map<number, number>();

    showCreateBoardModal(initialOrder = 0): void {
        this.boardService.create(initialOrder);
    }

    showEditBoardModal(board: Board): void {
        this.boardService.update(board);
    }

    showArchiveBoardModal(board: Board): void {
        this.boardService.archive(board);
    }

    showRemoveBoardModal(id: number): void {
        this.boardService.remove(id);
    }

    boardOrderChange(map: Map<number, number>): void {
        this.boardService.updateOrder(map, this.boards);
    }

    selectBoard(id: number): void {
        this.boardService.setActiveBoardId(id);
    }
}
