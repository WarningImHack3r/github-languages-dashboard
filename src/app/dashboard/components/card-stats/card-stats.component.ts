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
          <span *ngIf="nameValue" class="nv" style="color: {{color}}" >{{nameValue}}</span>
          <br>
          <span *ngIf="val" class="v" style="color: {{color}}">{{val}}</span>
      </mat-card-content>
      <mat-card-footer>
        
      </mat-card-footer>
    </mat-card>
  `,
  styles: [`
    .nv {
    }

    .v {
      font-size: 2rem;
      font-weight: 600;
    }
  `]
})
export class CardStatsComponent {

  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() val!: string;
  @Input() nameValue!: string;
  @Input() icon!: string;
  @Input() color!: string;
}
