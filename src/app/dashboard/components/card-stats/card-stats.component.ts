import { Component, Input } from '@angular/core';

@Component({
  selector: 'card-stats',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{title}}</mat-card-title>
        <mat-card-subtitle>{{subtitle}}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <span class="card-number">{{value}}</span>
      </mat-card-content>
      <mat-card-actions>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    
  `]
})
export class CardStatsComponent {

  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() value!: number;
  @Input() icon!: string;
  @Input() color!: string;
}
