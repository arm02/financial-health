import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../domain/entities/dialog.entities';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <div class="confirmation-dialog">
      <h3>{{ data.title || 'Are you sure?' }}</h3>
      <span>{{ data.message || 'Do you want take this action...' }}</span>
      <div class="form-action">
        <button class="btn-primary" (click)="dialogRef.close(true)">
          {{ data.btnConfirm || 'Confirm' }}
        </button>
        <button class="btn-danger" (click)="dialogRef.close(false)">
          {{ data.btnCancel || 'Cancel' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host h3 {
        margin: 0px !important;
      }
      .confirmation {
        &-dialog {
          display: flex;
          flex-direction: column;
          gap: 10px;
          & > .form-action {
            & > button {
              width: 30%;
            }
          }
          & > span {
            font-size: 14px;
            margin-bottom: 20px;
          }
        }
      }
    `,
  ],
})
export class ConfirmationLocal {
  readonly dialogRef = inject(MatDialogRef<ConfirmationLocal>);
  readonly data = inject<ConfirmationDialog>(MAT_DIALOG_DATA);
}
