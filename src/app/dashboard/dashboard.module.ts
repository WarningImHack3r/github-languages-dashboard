import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CardStatsComponent } from './components/card-stats/card-stats.component';
import { NgIconsModule } from '@ng-icons/core';
import * as bootstrap from '@ng-icons/bootstrap-icons';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ 
    DashboardComponent,
    CardStatsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,

    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgIconsModule.withIcons({ ...bootstrap }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ]
})
export class DashboardModule { }
