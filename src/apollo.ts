import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

import { githubGraphQLEndpoint } from "./config";
import { readKeyFromLocalStorage } from "./helpers";

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const httpLink = createHttpLink({
    uri: githubGraphQLEndpoint,
  });

  const authLink = setContext((_, { headers }) => {
    const githubToken = readKeyFromLocalStorage<string>("githubToken", "");
    return {
      headers: {
        ...headers,
        authorization: githubToken ? `bearer ${githubToken}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
