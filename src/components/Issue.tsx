import React from "react";

import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { GetIssue, GetIssueRes } from "../graphql";
import { Error } from "./Error";
import { GithubConfig } from "../types";

import { IssueCommentList } from "./IssueCommentList";
import { IssueComment } from "./IssueComment";

export const Issue: React.FC<{
  githubConfig: Required<GithubConfig>;
}> = ({ githubConfig }) => {
  const { issueNumber: issueNumberParam } = useParams();
  const issueNumber = parseInt(issueNumberParam, 10);

  const { loading, error, data } = useQuery<GetIssueRes>(GetIssue, {
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
    <div>
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
