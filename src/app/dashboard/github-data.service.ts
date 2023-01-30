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

  getInfoOnSchema(): Observable<ApolloQueryResult<GraphQlQueryResponseData>> {
    return this.apollo.watchQuery<GraphQlQueryResponseData>({
      query: gql`
        query {
          __schema {
            types {
              name
            }
          }
        }
      `
    }).valueChanges.pipe(map(result => result.data["__schema"].types));
  }

  getInfoOnType(typeName: string): Observable<ApolloQueryResult<GraphQlQueryResponseData>> {
      return this.apollo.watchQuery<GraphQlQueryResponseData>({
      query: gql`
        query($typeName: String!) {
          __type(name: $typeName) {
            name
            fields {
              name
              type {
                name
              }
            }
          }
        }
      `,
      variables: {
        typeName: typeName
      }
    }).valueChanges.pipe(map(result => result.data["__type"])); }

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
