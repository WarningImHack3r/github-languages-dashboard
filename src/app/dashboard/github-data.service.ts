import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: "root"
})
export class GithubDataService {

  constructor(private apollo: Apollo) {}

  getInfoOfRepo(owner: string, name: string): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
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
                color
              }
              totalSize
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
      `,
      variables: {
        owner: owner,
        name: name
      }
    }).valueChanges.pipe(
      map(result => result.data["repository"])
    );
  }

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
        return {
          androidCount: languages.reduce((acc: number, lang: any) => {
            if (lang.name === "Java" || lang.name === "Kotlin") {
              return lang.count;
            }
            return acc;
          }),
          appleCount: languages.reduce((acc: number, lang: any) => {
            if (lang.name === "Swift" || lang.name === "Objective-C" || lang.name === "Objective-C++") {
              return lang.count;
            }
            return acc;
          })
        };
      })
    );
  }

  getLanguagesCountOverTime(limit: number): Observable<any> {
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
                        ref(qualifiedName: "main") {
                            target {
                                ... on Commit {
                                    history {
                                        nodes {
                                            id
                                            committedDate
                                        }
                                    }
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
      }}).valueChanges.pipe(
      map(result => result.data["search"].nodes
        .filter((repo: any) => repo.ref !== null)
        .filter((repo: any) => repo.languages.nodes[0] !== undefined)
        .map((repo: any) => {
          return {
            languages: repo.languages.nodes[0],
            commits: repo.ref.target.history.nodes
          };
        }
      ))
    ).pipe(
      map((repos: any) => {
        const languages: any = {};
        repos.forEach((repo: any) => {
          repo.commits.forEach((commit: any) => {
            const year = new Date(commit.committedDate).getFullYear();
            if (languages[year]) {
              if (languages[year][repo.languages.name]) {
                languages[year][repo.languages.name] += 1;
              } else {
                languages[year][repo.languages.name] = 1;
              }
            } else {
              languages[year] = {};
              languages[year][repo.languages.name] = 1;
            }
          });
        });
        return languages;
      }
    )).pipe(
      map((languages: any) => {
        const languagesOverTime: any = [];
        Object.keys(languages).forEach((year: any) => {
          const languagesForYear: any = [];
          Object.keys(languages[year]).forEach((language: any) => {
            languagesForYear.push({
              name: language,
              count: languages[year][language]
            });
          });
          languagesOverTime.push({
            year: year,
            languages: languagesForYear
          });
        });
        return languagesOverTime;
      })
    );
  }

  getNumberOfCommitsOverTime(limit: number): Observable<any> {
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
                ref(qualifiedName: "main") {
                  target {
                    ... on Commit {
                      history {
                        nodes {
                          id
                          committedDate
                        }
                      }
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
        .map((repo: any) => repo.ref)
        .filter((ref: any) => ref !== null)
        .map((ref: any) => ref.target.history.nodes)
        .reduce((acc: any, nodes: any) => {
          nodes.forEach((node: any) => {
            const date = new Date(node.committedDate);
            if (acc[date.getFullYear()]) {
              acc[date.getFullYear()] += 1;
            } else {
              acc[date.getFullYear()] = 1;
            }
          });
          return acc;
        }, [])
      ),
      map((commits: any) => {
        const years = Object.keys(commits);
        return years.map((year: any) => {
          return {
            year: year,
            count: commits[year]
          };
        });
      })
    );
  }

  getNumberOfLicensesUsage(limit: number): Observable<any> {
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
                licenseInfo {
                  name
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
        .filter((repo: any) => repo.licenseInfo !== null)
        .reduce((acc: any, repo: any) => {
          if (acc[repo.licenseInfo.name]) {
            acc[repo.licenseInfo.name] += 1;
          } else {
            acc[repo.licenseInfo.name] = 1;
          }
          return acc;
        }, {})
      ),
      map((licenses: any) => {
        const licensesNames = Object.keys(licenses);
        return licensesNames.map((license: any) => {
          return {
            name: license,
            count: licenses[license]
          };
        });
      })
    );
  }
}

export interface TopLanguagesDate {
  name: string;
  count: number;
}

export interface TopCommitOverTime {
  year: string;
  count: number;
}