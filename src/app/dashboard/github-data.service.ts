import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { graphql } from "@octokit/graphql";
import type { GraphQlQueryResponseData } from "@octokit/graphql";

@Injectable({
  providedIn: "root"
})
export class GithubDataService {
  graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}` // TODO: how to inject this token?
    }
  });

  constructor() {}

  getGithubData(): Observable<any> {
    const data = {
      name: 'John',
      age: 30,
      car: 'Ford'
    };

    return of(data);
  }

  async getRepo(owner: string, repo: string): Promise<Observable<any>> {
    // TODO: how to console.log to test this function?
    const { repository } = await this.graphqlWithAuth<GraphQlQueryResponseData>({
      query: `
        query {
          repository(owner: $owner, name: $repo) {
            name
            url
          }
        }
      `,
      owner: owner,
      repo: repo
    });
    return of(repository); // TODO: is this the right way to return the data?
  }
}
