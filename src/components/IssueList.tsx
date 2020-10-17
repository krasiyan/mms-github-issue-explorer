import React from "react";

import { useQuery, gql } from "@apollo/client";
import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { Search, IssueStateFilter } from "./Search";
import { IssueListItem } from "./IssueListItem";
import { Error } from "./Error";
import { GithubConfig, GQLListIssues } from "./types";

const issuesQuery = gql`
  query SearchIssues($query: String!) {
    search(type: ISSUE, query: $query, last: 100) {
      nodes {
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
  ];

  if (issueStateFilter === IssueStateFilter.open) {
    query.push("is:open");
  } else if (issueStateFilter === IssueStateFilter.closed) {
    query.push("is:closed");
  }

  const { loading, error, data } = useQuery<GQLListIssues>(issuesQuery, {
    variables: {
      query: query.join(" "),
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || data.search.nodes.length === 0)
    return (
      <Alert severity="info">
        <AlertTitle>No issues found</AlertTitle>
      </Alert>
    );

  return (
    <>
      {data.search.nodes.map(
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
