import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";

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
    cache: new InMemoryCache({
      typePolicies: {
        // the user (`author` prop) `login` (username) is distinct no matter if
        // the user data is fetched from the `GetIssue` query or the `SearchIssues`
        User: {
          keyFields: ["login"],
        },
        // `Repository` queries are the ones for fetching single issues (`GetIssue`)
        // hence the nested `id` prop. of the issue should be used as the cache key
        Repository: {
          keyFields: [["id"]],
        },
        Issue: {
          fields: {
            // pagination policy for comment retrieval
            comments: relayStylePagination([["issueNumber"]]),
          },
        },
        Query: {
          fields: {
            // pagination policy for issue search/list
            search: relayStylePagination(["query"]),
          },
        },
      },
    }),
    connectToDevTools: true,
  });
};
