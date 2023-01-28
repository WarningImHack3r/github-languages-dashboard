import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubDataService {

  constructor() { }

  getGithubData(): Observable<any> {
    const data = {
      name: 'John',
      age: 30,
      car: 'Ford'
    };

    return of(data);

  }
}
