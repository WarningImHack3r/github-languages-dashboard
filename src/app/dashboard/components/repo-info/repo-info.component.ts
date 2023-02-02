import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GithubDataService } from '../../github-data.service';

@Component({
  template: `
    <h1>Repositories </h1>
    <div class="content">
      <div class="info" *ngIf="repoInfo; else loading">
        <span>Project Name: {{repoInfo.name}}</span>
        <span>Owner: {{repoInfo.owner.login}}</span>
        <br>
        <span class="stars"><span>Numbers of stars:  {{repoInfo.stargazers.totalCount}}</span></span>

        <span>Languages:</span>
        <div class="languages">
          <ng-container  *ngFor="let node of repoInfo.languages.nodes">
            <span style="color: {{node.color}};">{{node.name}} </span>
          </ng-container>
        </div>

      </div>
    </div>

    <ng-template #loading>
      <mat-spinner class="loading" mat-spinner></mat-spinner>
    </ng-template>

  `,
  styles: [`

    :host {
      display: block;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      overflow: hidden;
      height: 100%;
    }

    h1 {
      text-align: center;
    }

    .content {
      padding: 20px;

      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }

      .stars {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      }

      .languages {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: center;
        gap: 10px;
      }
    }

    .loading {
      display: block;
      position : absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `]
})
export class RepoInfoComponent {

  owner!: string;
  name!: string;
  repoInfo!: RepoInfo | undefined;

  constructor(
    private githubDataService: GithubDataService,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.owner = _data.owner;
    this.name = _data.name;

    this.githubDataService.getInfoOfRepo(_data.owner, _data.name).subscribe((data: RepoInfo) => {
      this.repoInfo = data;
    });
  }

}

interface RepoInfo {
  languages: {
    nodes: {
      name: string,
      color: string,
    }[],
  },
  name: string,
  owner: {
    login: string,
  },
  stargazers: {
    totalCount: number,
  }
}
