import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type SnackbarType = 'SUCCESS' | 'WARNING' | 'DANGER' | 'SECONDARY' | 'PRIMARY';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) { }

    show(message: string, type: SnackbarType = 'PRIMARY', action: string = '', duration: number = 30000) {
        const ref = this.snackBar.open(message, action, {
            duration,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['snackbar', `snackbar-${type.toLowerCase()}`], // e.g. 'snackbar-success'
        });

        ref.onAction().subscribe(() => {
            ref.dismiss();
        });

        setTimeout(() => {
            const container = document.querySelector('.mat-mdc-snack-bar-container');
            if (container) {
                container.addEventListener('click', () => ref.dismiss(), { once: true });
            }
        }, 0);
    }
}
