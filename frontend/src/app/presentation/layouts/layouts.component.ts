import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar],
  styleUrls: ['./layouts.component.scss'],
  template: `
    <div class="content" role="main">
      <app-sidebar></app-sidebar>
      <div class="body-layout">
        <app-navbar></app-navbar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class LayoutsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
