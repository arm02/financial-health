import { CommonModule, NgClass } from '@angular/common';
import { Component, ComponentRef, Inject, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InformationDialogDTO } from '../../domain/dto/dialog.dto';

@Component({
  selector: 'app-information-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgClass],
  template: `
    <div class="dialog-body">
      @if (parameter.asset) {
        <img class="image" [src]="parameter.asset" [alt]="parameter.asset" />
      } @else if (parameter.icon) {
        <mat-icon [ngClass]="parameter.iconClass || ''">{{ parameter.icon }}</mat-icon>
      }

      <h5 class="title" [ngClass]="parameter.titleClass"> {{ parameter.title }} </h5>
      <p class="subtitle" [ngClass]="parameter.subtitleClass"> {{ parameter.subtitle }} </p>
    </div>
    <div class="dialog-footer">
      @if (parameter.cancelButton) {
        <button (click)="close(false)" [ngClass]="parameter.cancelClass"> {{ parameter.cancelButton }} </button>
      }

      <button (click)="close(true)" [ngClass]="parameter.submitClass"> {{ parameter.submitButton }} </button>
    </div>
  `,
  styles: [
    `
      .dialog-header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ececec;
        padding-bottom: 10px;
        margin-bottom: 18px;
      }
      .dialog-header mat-icon {
        cursor: pointer;
        transition: background 0.15s ease;
        &:hover {
          transform: translateY(-1px);
        }
      }
      .dialog-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      .dialog-body image {
        width: 100%;
      }
      .dialog-body mat-icon {
        font-size: 6rem;
        width: max-content;
        height: max-content;
      }
      .dialog-body .title {
        margin: 0;
        font-size: 18px;
        font-weight: 550;
      }
      .dialog-body .subtitle {
        margin: 0;
        font-size: 14px;
        font-weight: normal;
      }
      .dialog-footer {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 14px;
      }
      .dialog-footer button {
        width: 100%;
      }
    `,
  ],
})
export class InformationDialogComponent {
  parameter: InformationDialogDTO = {
    icon: 'check_circle_outline',
    title: 'Success!',
    subtitle: 'Process Successfully!',
    submitButton: 'Done',
    submitClass: 'btn-primary',
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public payload: { data: { title: string, data: InformationDialogDTO} },
    private dialogRef: MatDialogRef<InformationDialogComponent>
  ) {

    this.parameter.asset = payload.data.data.asset || '';
    this.parameter.icon = payload.data.data.icon || '';
    this.parameter.iconClass = payload.data.data.iconClass || '';
    this.parameter.title = payload.data.data.title || '';
    this.parameter.titleClass = payload.data.data.titleClass || '';
    this.parameter.subtitle = payload.data.data.subtitle || '';
    this.parameter.subtitleClass = payload.data.data.subtitleClass || '';
    this.parameter.submitButton = payload.data.data.submitButton || this.parameter.submitButton;
    this.parameter.submitClass = payload.data.data.submitClass || this.parameter.submitClass;
    this.parameter.cancelButton = payload.data.data.cancelButton || this.parameter.cancelButton;
    this.parameter.cancelClass = payload.data.data.cancelClass || this.parameter.cancelClass;
  }

  close(res = false) {
    this.dialogRef.close(res);
  }
}
