import { Component, Input } from '@angular/core';

@Component({
  selector: 'card-stats',
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{title}}</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  `,
  styles: [`

    .card {
      border: 0;
      border-radius: 0.25rem;
      box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
      background: #fff;
    }

    .card-body {
      padding: 1.25rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .card-text {
      font-size: 0.875rem;
      font-weight: 400;
    }
    

  `]
})
export class CardStatsComponent {

  @Input() title!: string;
  @Input() value!: number;
  @Input() icon!: string;
  @Input() color!: string;

}
