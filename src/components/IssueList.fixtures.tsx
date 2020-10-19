import { MockedResponse } from "@apollo/client/testing";
import { FetchResult } from "@apollo/client/core";

import { SearchIssues, IssuePreview, IssueState } from "../graphql";

export const mockIssuePreview: IssuePreview = {
  id: "testid",
  number: 123,
  state: IssueState.OPEN,
  title: "test title",
  author: { login: "krasiyan" },
  createdAt: "2020-10-19T05:00:00Z",
  comments: { totalCount: 100 },
};

export const getGQLMocks = (
  query: string,
  issuePreviews: IssuePreview[]
): MockedResponse[] => {
  const result: MockedResponse["result"] = {
    data: {
      search: {
        edges: issuePreviews.map((issuePreview) => ({
          node: { ...issuePreview, __typename: "Issue" },
        })),
        pageInfo: {
          startCursor: "teststart",
          hasPreviousPage: false,
          hasNextPage: false,
          endCursor: "testend",
        },
      },
    },
  };

  return [
    {
      request: {
        query: SearchIssues,
        variables: {
          query,
        },
      },
      result: result,
      newData: (): FetchResult => ({ ...result }),
    },
  ];
};
