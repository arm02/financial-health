import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogLocal } from '../components/dialog';
import { ConfirmationLocal } from '../components/confirmation';

export interface DialogParams {
  title?: string;
  width?: string;
  height?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  readonly dialog = inject(MatDialog);

  Open(component: any, params?: DialogParams): Observable<any> {
    const dialogConfig: any = {
      data: {
        component,
        title: params?.title,
        data: params,
      },
      maxWidth: 'none',
      panelClass: 'global-dialog-padding',
    };

    if (params?.width) {
      dialogConfig.width = params.width;
    }

    if (params?.height) {
      dialogConfig.height = params.height;
    }

    const dialogRef = this.dialog.open(DialogLocal, dialogConfig);
    return dialogRef.afterClosed();
  }

  Confirmation(): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmationLocal, {
      data: {},
      width: '400px',
      panelClass: 'global-dialog-padding',
    });
    return dialogRef.afterClosed();
  }
}
