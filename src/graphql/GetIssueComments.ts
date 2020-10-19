import { gql } from "@apollo/client";

import { Author, PageInfo } from "./common";

export const GetIssueComments = gql`
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

export interface IssueComment {
  id: string;
  createdAt: string;
  author: Author;
  bodyHTML: string;
}

interface GetIssueCommentsEdge {
  node: IssueComment;
}

export interface GetIssueCommentsRes {
  repository: {
    issue: {
      id: string;
      comments: {
        edges: GetIssueCommentsEdge[];
        pageInfo: PageInfo;
      };
    };
  };
}
