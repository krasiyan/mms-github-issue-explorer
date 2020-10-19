import { MockedResponse } from "@apollo/client/testing";
import { FetchResult } from "@apollo/client/core";

import {
  GetIssue,
  GetIssueComments,
  Author,
  Issue as IssueType,
  IssueComment as IssueCommentType,
  IssueState,
} from "../graphql";
import { GithubConfig } from "../types";

const mockAuthor: Author = {
  avatarUrl: "https://krasiyan.com/me.svg",
  login: "krasiyan",
  url: "https://github.com/krasiyan",
};

export const mockIssue: IssueType = {
  id: "testid",
  number: 123,
  state: IssueState.OPEN,
  title: "test title",
  url: "https://github.com/krasiyan/dotfiles/issues/0",
  author: mockAuthor,
  bodyHTML: "<h1>test body</h1>",
  createdAt: "2020-10-19T05:00:00Z",
};

export const getGQLMocks = (
  issue: IssueType,
  comments: IssueCommentType[],
  mockGithubConfig: Required<GithubConfig>
): MockedResponse[] => [
  {
    request: {
      query: GetIssue,
      variables: {
        githubRepositoryOwner: mockGithubConfig.repositoryOwner,
        githubRepositoryName: mockGithubConfig.repositoryName,
        issueNumber: 123,
      },
    },
    result: {
      data: {
        repository: {
          issue,
        },
      },
    },
    newData: (): FetchResult => ({
      data: {
        repository: {
          issue,
        },
      },
    }),
  },
  {
    request: {
      query: GetIssueComments,
      variables: {
        githubRepositoryOwner: mockGithubConfig.repositoryOwner,
        githubRepositoryName: mockGithubConfig.repositoryName,
        issueNumber: 123,
      },
    },
    result: {
      data: {
        repository: {
          issue: {
            id: issue.id,
            comments: {
              edges: comments.map((comment) => ({
                node: comment,
              })),
              pageInfo: {
                startCursor: "teststart",
                hasPreviousPage: false,
                hasNextPage: false,
                endCursor: "testend",
              },
            },
          },
        },
      },
    },
  },
];
