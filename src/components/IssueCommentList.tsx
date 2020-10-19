import React from "react";

import { useQuery } from "@apollo/client";
import { LinearProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { GetIssueComments, GetIssueCommentsRes } from "../graphql";
import { GithubConfig } from "../types";

import { IssueComment } from "./IssueComment";
import { LoadMore } from "./LoadMore";
import { Error } from "./Error";

export const IssueCommentList: React.FC<{
  githubConfig: Required<GithubConfig>;
  issueNumber: number;
}> = ({ githubConfig, issueNumber }) => {
  const { loading, error, data, fetchMore } = useQuery<GetIssueCommentsRes>(
    GetIssueComments,
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
        <AlertTitle>No comments yet</AlertTitle>
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
              isRootComment: false,
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
