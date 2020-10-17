import React from "react";

import { useQuery, gql } from "@apollo/client";
import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { Search, IssueStateFilter } from "./Search";
import { IssueListItem } from "./IssueListItem";
import { Error } from "./Error";
import { GithubConfig, GQLListIssues } from "./types";

const issuesQuery = gql`
  query ListIssues(
    $githubRepositoryName: String!
    $githubRepositoryOwner: String!
    $issueStates: [IssueState!]
  ) {
    repository(name: $githubRepositoryName, owner: $githubRepositoryOwner) {
      issues(last: 10, states: $issueStates) {
        nodes {
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
  }
`;

const IssueListItems: React.FC<{
  githubRepositoryOwner: string;
  githubRepositoryName: string;
  issueStateFilter: IssueStateFilter;
}> = ({ githubRepositoryOwner, githubRepositoryName, issueStateFilter }) => {
  const issueStates: string[] =
    issueStateFilter === IssueStateFilter.both
      ? ["OPEN", "CLOSED"]
      : issueStateFilter === IssueStateFilter.open
      ? ["OPEN"]
      : ["CLOSED"];
  const { loading, error, data } = useQuery<GQLListIssues>(issuesQuery, {
    variables: {
      githubRepositoryOwner,
      githubRepositoryName,
      issueStates,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || data.repository.issues.nodes.length === 0)
    return (
      <Alert severity="info">
        <AlertTitle>No issues found</AlertTitle>
      </Alert>
    );

  return (
    <>
      {data.repository.issues.nodes.map(
        ({
          id,
          number,
          title,
          state,
          createdAt,
          author: { login: authorLogin },
          comments: { totalCount: totalCommentCount },
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
    </>
  );
};

export const IssueList: React.FC<{
  githubConfig: Required<GithubConfig>;
}> = ({ githubConfig }) => {
  const [issueStateFilter, setIssueStateFilter] = React.useState<
    IssueStateFilter
  >(IssueStateFilter.both);

  return (
    <>
      <Search {...{ issueStateFilter, setIssueStateFilter }} />
      <IssueListItems
        {...{
          githubRepositoryName: githubConfig.repositoryName,
          githubRepositoryOwner: githubConfig.repositoryOwner,
          issueStateFilter,
        }}
      />
    </>
  );
};
