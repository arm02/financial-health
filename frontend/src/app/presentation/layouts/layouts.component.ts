import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="content" role="main">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class LayoutsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
