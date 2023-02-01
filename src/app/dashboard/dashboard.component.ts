import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GithubDataService, TopLanguagesDate } from './github-data.service';
import * as echarts from 'echarts';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Doughnut_Chartget } from './chart-option';
import { MatDialog } from '@angular/material/dialog';
import { RepoInfoComponent } from './components/repo-info/repo-info.component';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  repositories: any;
  isLoading = true;
  lightMode = true;
  displayedColumns: string[] = ['name', 'value', 'percent'];

  displayedColumnsTopRepos: string[] = ['owner', 'name', 'stargazers'];
  dataSourceTopRepos = new MatTableDataSource<any>([{},{},{},{},{},{},{},{},{},{}]);
  @ViewChild('PaginatorTopRepos') paginatorTopRepos!: MatPaginator ;
  @ViewChild('SortTopRepos') sortTopRepos!: MatSort;

  displayedColumnsTopLanguages: string[] = ['name', 'count', ];
  dataSourceTopLanguages = new MatTableDataSource<any>([{},{},{},{},{},{},{},{},{},{}]);
  @ViewChild('PaginatorTopLanguages') paginatorTopLanguages!: MatPaginator ;
  @ViewChild('SortTopLanguages') sortTopLanguages!: MatSort;

  Doughnut_Chartget_TopLanguages: EChartsOption = Doughnut_Chartget;
  Doughnut_Chartget_AndroidvsApple: EChartsOption = Doughnut_Chartget;

  years: number[];
  DialogReposComponentRef: any;

  constructor(
    private githubDataService: GithubDataService,
    private _changeDetector: ChangeDetectorRef,
    private _matDialog: MatDialog,


    ) {
    this.isLoading = true;

    this.githubDataService.getTopRepos(100).subscribe(result => {
      this.dataSourceTopRepos = new MatTableDataSource(result);
      this.dataSourceTopRepos.paginator = this.paginatorTopRepos;
      this.dataSourceTopRepos.sort = this.sortTopRepos;
    });

    this.githubDataService.getTopLanguages(100).subscribe((data: TopLanguagesDate[]) => {
      this.dataSourceTopLanguages = new MatTableDataSource(data);
      this.dataSourceTopLanguages.paginator = this.paginatorTopLanguages;
      this.dataSourceTopLanguages.sort = this.sortTopLanguages;

      // Doughnut_Chart
      const series = this.Doughnut_Chartget_TopLanguages.series as echarts.SeriesOption[];
      series[0].data = data.map(d => ({ value: d.count, name: d.name }));
      this.Doughnut_Chartget_TopLanguages.series = series;
      this.Doughnut_Chartget_TopLanguages = { ...this.Doughnut_Chartget_TopLanguages };
      this.isLoading = false;
      this._changeDetector.detectChanges();
    });

    this.githubDataService.getAppleVsAndroidLanguagesCount(100).subscribe(data => {
      // Doughnut_Chart
      const series = this.Doughnut_Chartget_AndroidvsApple.series as echarts.SeriesOption[];
      series[0].data = [{value: data.androidCount, name: 'Android'}, { value: data.appleCount, name: 'Apple'}]
      this.Doughnut_Chartget_AndroidvsApple.series = series;
      this.Doughnut_Chartget_AndroidvsApple = { ...this.Doughnut_Chartget_AndroidvsApple };
      this.isLoading = false;
      this._changeDetector.detectChanges();
    });

    this.githubDataService.getMostUsedIDEs(100).subscribe(data => {
      console.log(data);
    });

    // array of years from 2008 (creation of GitHub) to today
    const initialYear = 2008;
    this.years = Array.from({ length: new Date().getFullYear() - initialYear + 1 }, (val, index) => index + initialYear);
  }

  ngOnInit() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDark.matches === this.lightMode) {
      this.toggleDarkTheme(!prefersDark.matches);
    }
  }

  onClickRepos(row: any): void {
    // console.log('onClickRepos', row);
    // Open Dialog with Repositories information
    this.DialogReposComponentRef = this._matDialog.open(RepoInfoComponent, {
      width: '30%',
      panelClass: 'dialog-repos',
      data: { owner: row.owner.login, name: row.name }
    });
  }

  toggleDarkTheme(light?: boolean) {
    if (light !== undefined) {
      this.lightMode = light;
      document.body.classList.toggle("dark-theme", !light);
    } else {
      this.lightMode = !this.lightMode;
      document.body.classList.toggle("dark-theme");
    }
  }
}
