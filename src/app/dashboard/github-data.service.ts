import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubDataService {

  constructor() { }

  getGithubData(): Observable<any> {
    return new Observable();
  }
}
