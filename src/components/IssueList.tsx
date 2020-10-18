import React from "react";

import { useQuery, gql } from "@apollo/client";
import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { graphQLPollingInterval } from "../config";
import { Search, IssueStateFilter } from "./Search";
import { IssueListItem } from "./IssueListItem";
import { LoadMore } from "./LoadMore";
import { Error } from "./Error";
import { GithubConfig, GQLSearchIssues } from "./types";

const issuesQuery = gql`
  query SearchIssues($query: String!, $after: String) {
    search(type: ISSUE, query: $query, last: 10, after: $after) {
      edges {
        node {
          ... on Issue {
            author {
              login
            }
            comments {
              totalCount
            }
            id
            number
            state
            title
            createdAt
          }
        }
      }
      pageInfo {
        startCursor
        hasPreviousPage
        hasNextPage
        endCursor
      }
    }
  }
`;

const IssueListItems: React.FC<{
  githubRepositoryOwner: string;
  githubRepositoryName: string;
  issueStateFilter: IssueStateFilter;
  issueTextFilter: string;
}> = ({
  githubRepositoryOwner,
  githubRepositoryName,
  issueStateFilter,
  issueTextFilter,
}) => {
  const query: string[] = [
    `repo:${githubRepositoryOwner}/${githubRepositoryName}`,
    `is:issue`,
    `sort:created`,
    issueTextFilter,
    ...(issueStateFilter === IssueStateFilter.open ? ["is:open"] : []),
    ...(issueStateFilter === IssueStateFilter.closed ? ["is:closed"] : []),
  ];

  const {
    loading,
    error,
    data,
    fetchMore,
    startPolling,
    stopPolling,
  } = useQuery<GQLSearchIssues>(issuesQuery, {
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
      console.log("start");
      return (): void => {
        console.log("stop");
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
  const [issueStateFilter, setIssueStateFilter] = React.useState<
    IssueStateFilter
  >(IssueStateFilter.both);

  const [issueTextFilter, setIssueTextFilter] = React.useState<string>("");

  return (
    <>
      <Search
        {...{
          issueStateFilter,
          setIssueStateFilter,
          issueTextFilter,
          setIssueTextFilter,
        }}
      />
      <IssueListItems
        {...{
          githubRepositoryName: githubConfig.repositoryName,
          githubRepositoryOwner: githubConfig.repositoryOwner,
          issueStateFilter,
          issueTextFilter,
        }}
      />
    </>
  );
};
