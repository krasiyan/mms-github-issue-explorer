export const defaultGitHubRepository = "https://github.com/facebook/react";
// https://regex101.com/r/8IgFO1/2/
export const githubRepositoryRegex = new RegExp(
  "^https?://github.com/(?<owner>.+?)/(?<name>.+?)(?:/|$)"
);
export const githubGraphQLEndpoint = "https://api.github.com/graphql";
// polling interval for re-fetching the newest set of results
// (in the issues and comments lists)
export const graphQLPollingInterval = 30000;
