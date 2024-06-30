import { Component, inject, OnInit } from '@angular/core';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiTextareaModule } from '@taiga-ui/kit';
import { TuiAutoFocusModule, tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDialogContext, TuiErrorModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseCreateModel, BaseUpdateModel } from '../../models/base.model';
import { AsyncPipe } from '@angular/common';
import { Board } from '../../models/board.model';
import { State } from '../../enums/state.enum';

type Data = {
    mode: 'create' | 'update';
    board: Board,
    initialOrder?: number,
}

@Component({
    selector: 'tracker-edit-dialog',
    standalone: true,
    imports: [
        TuiInputModule,
        TuiAutoFocusModule,
        TuiTextfieldControllerModule,
        TuiTextareaModule,
        ReactiveFormsModule,
        TuiButtonModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        AsyncPipe
    ],
    templateUrl: './edit-dialog.component.html',
    styleUrl: './edit-dialog.component.less',
})
export class EditDialogComponent implements OnInit {

    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<BaseCreateModel | BaseUpdateModel, Data>;
    private readonly fb = inject(FormBuilder);

    readonly form = this.fb.group({
        name: this.fb.nonNullable.control<string>('', {
            validators: [Validators.required, Validators.maxLength(100)]
        }),
        description: this.fb.control<string | null>(null, {
            validators: [Validators.maxLength(1000)]
        }),
    })

    get data(): Data {
        return this.context.data;
    }

    ngOnInit(): void {
        if (this.data.mode === 'update') {
            const { name, description } = this.data.board || {};
            this.form.patchValue({
                name,
                description,
            })
        }
    }

    close(): void {
        this.context.$implicit.complete();
    }

    createOrUpdate(): void {
        tuiMarkControlAsTouchedAndValidate(this.form);
        if (this.form.invalid) {
            return;
        }
        const {name, description} = this.form.getRawValue();
        if (this.data.mode === 'update') {
            const { order, state } = this.data.board;
            this.context.completeWith({
                name,
                description,
                order: order || 0,
                state: state || State.Active,
            });
        } else {
            this.context.completeWith({
                name,
                description,
                order: this.data.initialOrder || 0,
            });
        }
    }

}
