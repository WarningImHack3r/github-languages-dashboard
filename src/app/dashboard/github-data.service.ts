import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: "root"
})
export class GithubDataService {

  constructor(private apollo: Apollo) {}

  getTopRepos(limit: number): Observable<any> {
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

  getTopLanguages(limit: number): Observable<any> {
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
      map(result => result.data["search"].nodes
        .map((repo: any) => repo.languages.nodes[0])
        .filter((lang: any) => lang !== undefined)
        .reduce((acc: TopLanguagesDate[], lang: any) => {
          const index = acc.findIndex((item: TopLanguagesDate) => item.name === lang.name);
          if (index === -1) {
            acc.push({ name: lang.name, count: 1 });
          } else {
            acc[index].count += 1;
          }
          return acc;
        }, [])
    ));
  }

  getMostUsedIDEs(limit: number): Observable<any> {
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
      map(result => result.data["search"].nodes
        .map((repo: any) => repo.object)
        .filter((obj: any) => obj !== null)
        .map((obj: any) => obj.entries)
        .reduce((acc: any, entries: any) => {
          entries.forEach((entry: any) => {
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
            } else if (entry.name.endsWith(".xcodeproj")) {
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
        }, {})
      )
    );
  }

  getAppleVsAndroidLanguagesCount(limit: number): Observable<any> {
    return this.getTopLanguages(limit).pipe(
      map((languages: any) => {
        const appleLanguages = (languages["Swift"] || 0) + (languages["Objective-C"] || 0) + (languages["Objective-C++"] || 0);
        const androidLanguages = (languages["Java"] || 0) + (languages["Kotlin"] || 0);
        return {
          appleCount: appleLanguages,
          androidCount: androidLanguages
        }})
    );
  }
}

export interface TopLanguagesDate {
  name: string;
  count: number;
}
