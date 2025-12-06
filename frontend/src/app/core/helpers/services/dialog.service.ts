import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogLocal } from '../components/dialog';

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
}
