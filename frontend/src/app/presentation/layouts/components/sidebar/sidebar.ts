import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SIDEBAR_MENU } from '../../../../data/collection/layouts/sidebar-menu.collection';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  sidebarList = structuredClone(SIDEBAR_MENU);
}
