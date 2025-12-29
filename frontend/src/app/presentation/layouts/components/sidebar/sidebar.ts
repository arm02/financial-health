import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SIDEBAR_MENU,
  SIDEBAR_MENU_RESPONSIVE,
} from '../../../../data/collection/layouts/sidebar-menu.collection';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, MatIconModule, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  sidebarList = structuredClone(SIDEBAR_MENU);
  sidebarListResponsive = structuredClone(SIDEBAR_MENU_RESPONSIVE);

  ngOnInit(): void {
    this.mappingSidebarListResponsive();
  }

  mappingSidebarListResponsive = () => {
    const data = this.sidebarListResponsive;
    const middleIndex = Math.floor(data.length / 2);

    [data[0], data[middleIndex]] = [data[middleIndex], data[0]];

    this.sidebarListResponsive = data;
  };
}
