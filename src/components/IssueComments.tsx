import React from "react";

import { useQuery, gql } from "@apollo/client";
import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { IssueComment } from "./IssueComment";
import { Error } from "./Error";
import { GithubConfig, GQLIssueComments } from "./types";

const commentsQuery = gql`
  query GetIssueComments(
    $githubRepositoryName: String!
    $githubRepositoryOwner: String!
    $issueNumber: Int!
  ) {
    repository(name: $githubRepositoryName, owner: $githubRepositoryOwner) {
      issue(number: $issueNumber) {
        id
        comments(first: 10) {
          nodes {
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
      }
    }
  }
`;

export const IssueComments: React.FC<{
  githubConfig: Required<GithubConfig>;
  issueNumber: number;
}> = ({ githubConfig, issueNumber }) => {
  const { loading, error, data } = useQuery<GQLIssueComments>(commentsQuery, {
    variables: {
      githubRepositoryName: githubConfig.repositoryName,
      githubRepositoryOwner: githubConfig.repositoryOwner,
      issueNumber,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || data.repository.issue.comments.nodes.length === 0)
    return (
      <Alert severity="info">
        <AlertTitle>No comments yets</AlertTitle>
      </Alert>
    );

  return (
    <>
      {data.repository.issue.comments.nodes.map(
        ({
          author: {
            login: authorLogin,
            url: authorUrl,
            avatarUrl: authorAvatarUrl,
          },
          bodyHTML,
          createdAt,
          id,
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
    </>
  );
};
