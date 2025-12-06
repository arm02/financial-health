import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Inject, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="dialog-header">
      <span>{{ payload.title }}</span>
      <mat-icon (click)="close()">close</mat-icon>
    </div>
  `,
  styles: [
    `
      .dialog-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;
      }
      mat-icon {
        cursor: pointer;
      }
    `,
  ],
})
export class DialogLocal {
  componentRef!: ComponentRef<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public payload: any,
    private vcr: ViewContainerRef,
    private dialogRef: MatDialogRef<DialogLocal>
  ) {
    const childComponent = payload.component;
    this.componentRef = this.vcr.createComponent(childComponent);
    this.componentRef.instance.data = payload.data || null;
  }

  close() {
    this.dialogRef.close('closed');
  }
}
