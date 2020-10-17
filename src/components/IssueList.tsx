import React from "react";

import { useQuery, gql } from "@apollo/client";
import { LinearProgress, Box } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { Search, IssueStateFilter } from "./Search";
import { IssueListItem } from "./IssueListItem";
import { Error, GithubRepositoryConfigError } from "./Error";

import { readKeyFromLocalStorage } from "../helpers";
import { defaultGitHubRepository, githubRepositoryRegex } from "../config";

const issuesQuery = gql`
  query ListIssues(
    $repoName: String!
    $repoOwner: String!
    $issueStates: [IssueState!]
  ) {
    repository(name: $repoName, owner: $repoOwner) {
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

interface Issue {
  createdAt: string;
  state: "OPEN" | "CLOSED";
  comments: {
    totalCount: number;
  };
  author: {
    login: string;
  };
  title: string;
  number: number;
  id: string;
}
interface RepositoryIssues {
  repository: {
    issues: { nodes: Issue[] };
  };
}

const IssueListItems: React.FC<{
  repoOwner: string | undefined;
  repoName: string | undefined;
  issueStateFilter: IssueStateFilter;
}> = ({ repoOwner, repoName, issueStateFilter }) => {
  const issueStates: string[] =
    issueStateFilter === IssueStateFilter.both
      ? ["OPEN", "CLOSED"]
      : issueStateFilter === IssueStateFilter.open
      ? ["OPEN"]
      : ["CLOSED"];
  const { loading, error, data } = useQuery<RepositoryIssues>(issuesQuery, {
    skip: !repoOwner || !repoName,
    variables: {
      repoOwner,
      repoName,
      issueStates,
    },
  });

  if (!repoOwner || !repoName) {
    return <GithubRepositoryConfigError />;
  }

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || data.repository.issues.nodes.length === 0)
    return (
      <Alert severity="info">
        <AlertTitle>No issues found</AlertTitle>
      </Alert>
    );

  return (
    <div>
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
    </div>
  );
};

export const IssueList: React.FC<{}> = () => {
  const githubRepository = readKeyFromLocalStorage(
    "githubRepository",
    defaultGitHubRepository
  );

  const githubRepositoryMatch = githubRepository.match(githubRepositoryRegex);
  const repoOwner = githubRepositoryMatch?.groups?.owner;
  const repoName = githubRepositoryMatch?.groups?.name;

  const [issueStateFilter, setIssueStateFilter] = React.useState<
    IssueStateFilter
  >(IssueStateFilter.both);

  return (
    <Box component="span" m={1}>
      {repoOwner && repoName && (
        <Search {...{ issueStateFilter, setIssueStateFilter }} />
      )}
      <IssueListItems
        {...{
          repoOwner,
          repoName,
          issueStateFilter,
        }}
      />
    </Box>
  );
};
