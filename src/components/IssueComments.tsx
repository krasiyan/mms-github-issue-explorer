import React from "react";

import { useQuery, gql } from "@apollo/client";
import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { IssueComment } from "./IssueComment";
import { LoadMore } from "./LoadMore";
import { Error } from "./Error";
import { GithubConfig, GQLIssueComments } from "./types";

const commentsQuery = gql`
  query GetIssueComments(
    $githubRepositoryName: String!
    $githubRepositoryOwner: String!
    $issueNumber: Int!
    $after: String
  ) {
    repository(name: $githubRepositoryName, owner: $githubRepositoryOwner) {
      issue(number: $issueNumber) {
        id
        comments(first: 10, after: $after) {
          edges {
            node {
              id
              createdAt
              author {
                login
                avatarUrl
                url
              }
              bodyHTML
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
    }
  }
`;

export const IssueComments: React.FC<{
  githubConfig: Required<GithubConfig>;
  issueNumber: number;
}> = ({ githubConfig, issueNumber }) => {
  const { loading, error, data, fetchMore } = useQuery<GQLIssueComments>(
    commentsQuery,
    {
      variables: {
        githubRepositoryName: githubConfig.repositoryName,
        githubRepositoryOwner: githubConfig.repositoryOwner,
        issueNumber,
      },
    }
  );

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || data.repository.issue.comments.edges.length === 0)
    return (
      <Alert severity="info">
        <AlertTitle>No comments yets</AlertTitle>
      </Alert>
    );

  const fetchMoreComments = (): void => {
    fetchMore({
      variables: {
        after: data.repository.issue.comments.pageInfo.endCursor,
      },
    });
  };

  return (
    <>
      {data.repository.issue.comments.edges.map(
        ({
          node: {
            author: {
              login: authorLogin,
              url: authorUrl,
              avatarUrl: authorAvatarUrl,
            },
            bodyHTML,
            createdAt,
            id,
          },
        }) => (
          <IssueComment
            {...{
              createdAt,
              authorLogin,
              authorUrl,
              authorAvatarUrl,
              bodyHTML,
            }}
            key={id}
          />
        )
      )}
      {data.repository.issue.comments.pageInfo.hasNextPage && (
        <LoadMore loadMore={fetchMoreComments} />
      )}
    </>
  );
};
