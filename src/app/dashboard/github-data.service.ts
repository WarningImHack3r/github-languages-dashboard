import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { GraphQlQueryResponseData } from "@octokit/graphql";
import { ApolloQueryResult } from "@apollo/client/core";

@Injectable({
  providedIn: "root"
})
export class GithubDataService {

  constructor(private apollo: Apollo) {}

  getRepo(owner: string, repo: string): Observable<ApolloQueryResult<GraphQlQueryResponseData>> {
    return this.apollo.watchQuery<GraphQlQueryResponseData>({
      query: gql`
        query($owner: String!, $repo: String!) {
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
    }).valueChanges.pipe(map(result => result.data["repository"]));
  }

  getWhoAmI(): Observable<ApolloQueryResult<GraphQlQueryResponseData>> {
    return this.apollo.watchQuery<GraphQlQueryResponseData>({
      query: gql`
        query {
          viewer {
            login
          }
        }
      `
    }).valueChanges.pipe(map(result => result.data["viewer"].login));
  }
}
