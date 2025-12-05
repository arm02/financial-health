import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SIDEBAR_MENU } from '../../../../data/collection/layouts/sidebar-menu.collection';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '../../../../core/helpers/services/dialog.service';
import { ButtonComponent } from '../../../../core/helpers/components/button';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  sidebarList = structuredClone(SIDEBAR_MENU);
  readonly dialogService = inject(DialogService);

  open() {
    this.dialogService.Open(ButtonComponent, { title: 'Button Dialog', width: '500px' }).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
