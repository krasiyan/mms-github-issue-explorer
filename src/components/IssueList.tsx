import React from "react";

import { useQuery, useReactiveVar } from "@apollo/client";

import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { issueTextFilter, issueStateFilter } from "../apollo";
import { graphQLPollingInterval } from "../config";
import { SearchIssues, SearchIssuesRes } from "../graphql";
import { GithubConfig } from "../types";

import { Search, IssueStateFilter } from "./Search";
import { IssueListItem } from "./IssueListItem";
import { LoadMore } from "./LoadMore";
import { Error } from "./Error";

const IssueListItems: React.FC<{
  githubRepositoryOwner: string;
  githubRepositoryName: string;
}> = ({ githubRepositoryOwner, githubRepositoryName }) => {
  const query: string[] = [
    `repo:${githubRepositoryOwner}/${githubRepositoryName}`,
    `is:issue`,
    `sort:created`,
    useReactiveVar(issueTextFilter),
    ...(useReactiveVar(issueStateFilter) === IssueStateFilter.open
      ? ["is:open"]
      : []),
    ...(useReactiveVar(issueStateFilter) === IssueStateFilter.closed
      ? ["is:closed"]
      : []),
  ];

  const {
    loading,
    error,
    data,
    fetchMore,
    startPolling,
    stopPolling,
  } = useQuery<SearchIssuesRes>(SearchIssues, {
    variables: {
      query: query.join(" "),
    },
  });

  // Once data is loaded - poll for new issues (re-run the query periodically)
  // TODO: pass the `before` param to the GQL query based on the data.search.pageInfo.startCursor
  // (so that existing data is not re-fetched)
  // Can be implemented once either of these Apollo client features are implemented:
  // https://github.com/apollographql/apollo-feature-requests/issues/176
  // https://github.com/apollographql/apollo-feature-requests/issues/226
  React.useEffect(() => {
    if (
      graphQLPollingInterval > 0 &&
      !loading &&
      data &&
      data?.search?.edges?.length > 0
    ) {
      startPolling(graphQLPollingInterval);
      return (): void => {
        stopPolling();
      };
    }
  }, [loading, data, startPolling, stopPolling]);

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || data.search.edges.length === 0)
    return (
      <Alert severity="info">
        <AlertTitle>No issues found</AlertTitle>
      </Alert>
    );

  const fetchMoreIssues = (): void => {
    fetchMore({
      variables: {
        after: data.search.pageInfo.endCursor,
      },
    });
  };

  return (
    <>
      {data.search.edges.map(
        ({
          node: {
            id,
            number,
            title,
            state,
            createdAt,
            author: { login: authorLogin },
            comments: { totalCount: totalCommentCount },
          },
        }) => (
          <IssueListItem
            {...{
              number,
              title,
              state,
              createdAt,
              authorLogin,
              totalCommentCount,
            }}
            key={id}
          />
        )
      )}
      {data.search.pageInfo.hasNextPage && (
        <LoadMore loadMore={fetchMoreIssues} />
      )}
    </>
  );
};

export const IssueList: React.FC<{
  githubConfig: Required<GithubConfig>;
}> = ({ githubConfig }) => {
  return (
    <>
      <Search />
      <IssueListItems
        {...{
          githubRepositoryName: githubConfig.repositoryName,
          githubRepositoryOwner: githubConfig.repositoryOwner,
        }}
      />
    </>
  );
};
