import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { environment } from 'src/environments/environment';

const uri = "https://api.github.com/graphql";
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const basic = setContext(() => ({
    headers: {
      Accept: "charset=utf-8"
    }
  }));

  const auth = setContext(() => {
    const token = environment.GITHUB_TOKEN;
    if (!token) {
      throw new Error("No token found");
    }

    return {
      headers: {
        Authorization: `token ${token}`
      }
    };
  });

  return {
    link: ApolloLink.from([basic, auth, httpLink.create({ uri })]),
    cache: new InMemoryCache()
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    }
  ]
})
export class GraphQLModule {}
