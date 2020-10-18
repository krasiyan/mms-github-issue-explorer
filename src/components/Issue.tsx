import React from "react";

import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { Error } from "./Error";
import { IssueCommentList } from "./IssueCommentList";
import { IssueComment } from "./IssueComment";
import { GithubConfig, GQLGetIssue } from "./types";

const issueQuery = gql`
  query GetIssue(
    $githubRepositoryName: String!
    $githubRepositoryOwner: String!
    $issueNumber: Int!
  ) {
    repository(name: $githubRepositoryName, owner: $githubRepositoryOwner) {
      issue(number: $issueNumber) {
        id
        number
        state
        title
        url
        author {
          avatarUrl(size: 40)
          login
          url
        }
        bodyHTML
        createdAt
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(5),
    },
  })
);

export const Issue: React.FC<{
  githubConfig: Required<GithubConfig>;
}> = ({ githubConfig }) => {
  const classes = useStyles();

  const { issueNumber: issueNumberParam } = useParams();
  const issueNumber = parseInt(issueNumberParam, 10);

  const { loading, error, data } = useQuery<GQLGetIssue>(issueQuery, {
    variables: {
      githubRepositoryOwner: githubConfig.repositoryOwner,
      githubRepositoryName: githubConfig.repositoryName,
      issueNumber,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || !data.repository.issue)
    return (
      <Alert severity="warning">
        <AlertTitle>Issue not found</AlertTitle>
      </Alert>
    );
  const { issue } = data.repository;

  return (
    <div className={classes.root}>
      <IssueComment
        {...{
          isRootComment: true,
          issueNumber,
          issueStatus: issue.state,
          issueTitle: issue.title,
          issueUrl: issue.url,
          createdAt: issue.createdAt,
          authorLogin: issue.author.login,
          authorUrl: issue.author.url,
          authorAvatarUrl: issue.author.avatarUrl,
          bodyHTML: issue.bodyHTML,
        }}
      />

      <IssueCommentList githubConfig={githubConfig} issueNumber={issueNumber} />
    </div>
  );
};
