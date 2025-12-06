import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [],
  template: ` @if(visibility) {
    <div class="loader" [style.width]="width"></div>
    }`,
  styles: [
    `
      .loader {
        width: 20px;
        aspect-ratio: 1;
        --c: no-repeat linear-gradient(#50a2ff 0 0);
        background: var(--c) 0% 100%, var(--c) 50% 100%, var(--c) 100% 100%;
        animation: l2 1s infinite linear;
      }
      @keyframes l2 {
        0% {
          background-size: 20% 100%, 20% 100%, 20% 100%;
        }
        20% {
          background-size: 20% 60%, 20% 100%, 20% 100%;
        }
        40% {
          background-size: 20% 80%, 20% 60%, 20% 100%;
        }
        60% {
          background-size: 20% 100%, 20% 80%, 20% 60%;
        }
        80% {
          background-size: 20% 100%, 20% 100%, 20% 80%;
        }
        100% {
          background-size: 20% 100%, 20% 100%, 20% 100%;
        }
      }
    `,
  ],
})
export class LoaderBarLocal {
  @Input() visibility = false;
  @Input() width = '20px';
}
