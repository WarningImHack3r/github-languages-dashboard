import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GithubDataService, TopCommitOverTime, TopLanguagesDate, TopLanguagesOverTime } from './github-data.service';
import * as echarts from 'echarts';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Basic_Area_Chart, Disk_DATA, Doughnut_Chartget, Point_Chart, Stacked_Area_Chart } from './chart-option';
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

  topRepositories: any;
  topLanguages: any;
  topFile: any;
  topCommits: any;

  displayedColumnsTopRepos: string[] = ['owner', 'name', 'stargazers'];
  dataSourceTopRepos = new MatTableDataSource<any>([{},{},{},{},{},{},{},{},{},{}]);
  @ViewChild('PaginatorTopRepos') paginatorTopRepos!: MatPaginator ;
  @ViewChild('SortTopRepos') sortTopRepos!: MatSort;

  Doughnut_Chartget_TopLanguages: EChartsOption = Doughnut_Chartget;
  Doughnut_Chartget_AndroidvsApple: EChartsOption = Doughnut_Chartget;
  Doughnut_Chartget_Ide: EChartsOption = Doughnut_Chartget;
  Chart_Commits: EChartsOption = Basic_Area_Chart;
  Area_Chart_Top_Languages: EChartsOption = Stacked_Area_Chart;
  Disk_Chart_File_root: EChartsOption = Disk_DATA;

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

      // this.topRepositories = result.Max((x: { stargazers: any; }) => x.stargazers);

      // get best repo by stargazers
      // Math.max(...array.map(o => o.y))
      console.log
      this.topRepositories = result.map((x: { owner: { login: any; }; stargazers: { totalCount: any; }; }) => {
        return {name: x.owner.login, stargazers: x.stargazers.totalCount}
      }).reduce((prev: { stargazers: number; }, current: { stargazers: number; }) => (prev.stargazers > current.stargazers) ? prev : current)
    });

    this.githubDataService.getTopLanguages(100).subscribe((data: TopLanguagesDate[]) => {
      // Doughnut_Chart
      const series = this.Doughnut_Chartget_TopLanguages.series as echarts.SeriesOption[];
      series[0].data = data.map(d => ({ value: d.count, name: d.name }));
      this.Doughnut_Chartget_TopLanguages.series = series;
      this.Doughnut_Chartget_TopLanguages = { ...this.Doughnut_Chartget_TopLanguages };
      this.isLoading = false;
      this.topLanguages = data.reduce((prev: TopLanguagesDate, current: TopLanguagesDate) => {
        return (prev.count > current.count) ? prev : current;
      })

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

    this.githubDataService.getFileAtRoot(100).subscribe((data: TopLanguagesDate[]) => {
      const series = this.Disk_Chart_File_root.series as echarts.SeriesOption[];
      series[0].name = 'File';
      series[0].data = data.map(d => ({ value: d.count, name: d.name }));
      this.Disk_Chart_File_root.series = series;
      this.Disk_Chart_File_root = { ...this.Disk_Chart_File_root };

      this.topFile = data.reduce((prev: TopLanguagesDate, current: TopLanguagesDate) => {
        return (prev.count > current.count) ? prev : current;
      })
      this._changeDetector.detectChanges();
    });

    this.githubDataService.getNumberOfCommitsOverTime(100).subscribe((data: TopCommitOverTime[]) => {
      this.Chart_Commits.xAxis = { data: data.map(d => d.year) };
      const series = this.Chart_Commits.series as echarts.SeriesOption[];
      series[0].data = data.map(d => d.count);
      this.Chart_Commits.series = series;
      this.Chart_Commits = { ...this.Chart_Commits };
      this.isLoading = false;
      this.topCommits = data.reduce((prev: TopCommitOverTime, current: TopCommitOverTime) => {
        return (prev.count > current.count) ? prev : current;
      })
      this._changeDetector.detectChanges();
    });

    this.githubDataService.getLanguagesCountOverTime(100).subscribe((data: TopLanguagesOverTime[]) => {
      this.Area_Chart_Top_Languages.legend = { data: [] };
      this.Area_Chart_Top_Languages.xAxis = { data: data.map(d => d.year) };
      const languages: string[] = [];
      data.forEach(d => d.languages.map(l => {
        if (!languages.includes(l.name)) {
          languages.push(l.name);
        }
      }));
      this.Area_Chart_Top_Languages.legend.data = languages;
      this.Area_Chart_Top_Languages.legend.bottom = 0;
      const seriesData = languages.map(language => {
        const counts: number[] = [];
        data.forEach(d => {
          const count = d.languages.find(l => l.name === language)?.count;
          if (count) {
            counts.push(count);
          } else {
            counts.push(0);
          }
        });

        return {
          name: language,
          type: 'line',
          stack: 'counts',
          areaStyle: {},
          data: counts
        } as echarts.SeriesOption;
      });

      this.Area_Chart_Top_Languages.series = seriesData;
      this.Area_Chart_Top_Languages = { ...this.Area_Chart_Top_Languages };
      this.isLoading = false;
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
