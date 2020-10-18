import { gql } from "@apollo/client";

import { Issue } from "./common";

export const GetIssue = gql`
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

export interface GetIssueRes {
  repository: {
    issue: Issue;
  };
}
