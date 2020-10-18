import { gql } from "@apollo/client";

import { IssuePreview, PageInfo } from "./common";

export const SearchIssues = gql`
  query SearchIssues($query: String!, $after: String) {
    search(type: ISSUE, query: $query, last: 10, after: $after) {
      edges {
        node {
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
      pageInfo {
        startCursor
        hasPreviousPage
        hasNextPage
        endCursor
      }
    }
  }
`;

interface SearchIssuesEdge {
  node: IssuePreview;
}

export interface SearchIssuesRes {
  search: {
    edges: SearchIssuesEdge[];
    pageInfo: PageInfo;
  };
}
