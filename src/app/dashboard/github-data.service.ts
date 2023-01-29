import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: "root"
})
export class GithubDataService {

  constructor(
    private apollo: Apollo
  ) {
    
  }

  getGithubData(): Observable<any> {
    const data = {
      name: 'John',
      age: 30,
      car: 'Ford'
    };

    return of(data);
  }

  // async getRepo(owner: string, repo: string): Promise<any> {
  //   // TODO: how to console.log to test this function?
  //   const { repository } = await this.graphqlWithAuth<GraphQlQueryResponseData>({
  //     query: `
  //       query {
  //         repository(owner: $owner, name: $repo) {
  //           name
  //           url
  //         }
  //       }
  //     `,
  //     owner: owner,
  //     repo: repo
  //   });
  //   return repository; // TODO: is this the right way to return the data?
  // }

  getRepo(owner: string, repo: string): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query ($owner: String!, $repo: String!){
          repository(owner: $owner, name: $repo) {
            name
            url
          }
        }
      `,
      variables: {
        owner: owner,
        repo: repo
      }
    }).valueChanges;
  }

  getWhoIAm(): Observable<any> {
    return this.apollo.watchQuery<string>({
      query: gql`
        query {
          viewer {
            login
          }
        }
      `
    }).valueChanges;
  }
}
