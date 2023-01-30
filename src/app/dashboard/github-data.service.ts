import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { ApolloQueryResult } from "@apollo/client/core";

@Injectable({
  providedIn: "root"
})
export class GithubDataService {

  constructor(private apollo: Apollo) {}

  getInfoOnSchema(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
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

  getInfoOnType(typeName: string): Observable<ApolloQueryResult<any>> {
      return this.apollo.watchQuery<any>({
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

  getTopRepos(limit: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($limit: Int!) {
          search(query: "stars:>10000", type: REPOSITORY, first: $limit) {
            nodes {
              ... on Repository {
                owner {
                  login
                }
                name
                stargazers {
                  totalCount
                }
              }
            }
          }
        }
      `,
      variables: {
        limit: limit
      }
    }).valueChanges.pipe(
      map(result => result.data["search"].nodes)
    );
  }

  getTopLanguages(limit: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($limit: Int!) {
          search(query: "stars:>10000", type: REPOSITORY, first: $limit) {
            nodes {
              ... on Repository {
                owner {
                  login
                }
                name
                stargazers {
                  totalCount
                }
                languages(first: 1) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        limit: limit
      }
    }).valueChanges.pipe(
      map(result => result.data["search"].nodes),
      map(repos => repos.reduce((acc: any, repo: any) => {
        // a fix
        const language = repo.languages.name;
        if (acc[language]) {
          acc[language] += 1;
        } else {
          acc[language] = 1;
        }
        return acc;
      }, {}))
    );
  }

  getTopContributors(limit: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($limit: Int!) {
          search(query: "stars:>10000", type: REPOSITORY, first: $limit) {
            nodes {
              ... on Repository {
                owner {
                  login
                }
                name
                stargazers {
                  totalCount
                }
                collaborators(first: 10) {
                  edges {
                    node {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        limit: limit
      }
    }).valueChanges.pipe(
      map(result => result.data["search"].nodes),
      map(repos => repos.reduce((acc: any, repo: any) => {
        // marche pas
        repo.collaborators.nodes.forEach((contributor: any) => {
          if (acc[contributor.login]) {
            acc[contributor.login] += 1;
          } else {
            acc[contributor.login] = 1;
          }
        });
        return acc;
      }))
    );
  }

  getMostUsedIDEs(limit: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($limit: Int!) {
          search(query: "stars:>10000", type: REPOSITORY, first: $limit) {
            nodes {
              ... on Repository {
                owner {
                  login
                }
                name
                stargazers {
                  totalCount
                }
                object(expression: "master:") {
                  ... on Tree {
                    entries {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        limit: limit
      }
    }).valueChanges.pipe(
      map(result => result.data["search"].nodes),
      map(repos => repos.reduce((acc: any, repo: any) => {
        // pb de foreach
        repo.object.entries.forEach((entry: any) => {
          if (entry.name === ".vscode") {
            if (acc["VSCode"]) {
              acc["VSCode"] += 1;
            } else {
              acc["VSCode"] = 1;
            }
          } else if (entry.name === ".idea") {
            if (acc["IntelliJ"]) {
              acc["IntelliJ"] += 1;
            } else {
              acc["IntelliJ"] = 1;
            }
          } else if (entry.name === ".project") {
            if (acc["Eclipse"]) {
              acc["Eclipse"] += 1;
            } else {
              acc["Eclipse"] = 1;
            }
          } else if (entry.name.includes(".xcodeproj")) {
            if (acc["XCode"]) {
              acc["XCode"] += 1;
            } else {
              acc["XCode"] = 1;
            }
          } else {
            if (acc["Other"]) {
              acc["Other"] += 1;
            } else {
              acc["Other"] = 1;
            }
          }
        });
        return acc;
      }, {}))
    );
  }

  getAppleLanguagesCount(limit: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($limit: Int!) {
          search(query: "stars:>10000", type: REPOSITORY, first: $limit) {
            nodes {
              ... on Repository {
                owner {
                  login
                }
                name
                stargazers {
                  totalCount
                }
                languages(first: 10) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        limit: limit
      }
    }).valueChanges.pipe(
      map(result => result.data["search"].nodes),
      map(repos => {
        // marche mais pas ce que je voulais
        const languages = repos.reduce((acc: any, repo: any) => {
          repo.languages.nodes.forEach((language: any) => {
            if (acc[language.name]) {
              acc[language.name] += 1;
            } else {
              acc[language.name] = 1;
            }
          });
          return acc;
        }, {});
        return Object.keys(languages).reduce((acc: any, language: any) => {
          if (language.includes("Swift") || language.includes("Objective-C")) {
            acc[language] = languages[language];
          }
          return acc;
        }, {});
      })
    );
  }

  getAndroidLanguagesCount(limit: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($limit: Int!) {
          search(query: "stars:>10000", type: REPOSITORY, first: $limit) {
            nodes {
              ... on Repository {
                owner {
                  login
                }
                name
                stargazers {
                  totalCount
                }
                languages(first: 10) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        limit: limit
      }
    }).valueChanges.pipe(
      map(result => result.data["search"].nodes),
      map(repos => {
        // pareil hein
        const languages = repos.reduce((acc: any, repo: any) => {
          repo.languages.nodes.forEach((language: any) => {
            if (acc[language.name]) {
              acc[language.name] += 1;
            } else {
              acc[language.name] = 1;
            }
          });
          return acc;
        }, {});
        return Object.keys(languages).reduce((acc: any, language: any) => {
          if (language.includes("Java") || language.includes("Kotlin")) {
            acc[language] = languages[language];
          }
          return acc;
        }, {});
      })
    );
  }
}
