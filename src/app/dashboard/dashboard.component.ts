import { Component, OnInit } from '@angular/core';
import { GithubDataService } from './github-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  constructor(
    private githubDataService: GithubDataService
  ) {
    this.githubDataService.getGithubData().subscribe(data => {
      console.log(data);
    });
  }


  ngOnInit(): void {
    
  }

}
