import React from "react";

import { useQuery, gql } from "@apollo/client";

import { LinearProgress } from "@material-ui/core";

import { IssueListItem } from "./IssueListItem";

import { Error } from "./Error";

const issuesQuery = gql`
  query MyQuery {
    repository(name: "react", owner: "facebook") {
      issues(last: 10) {
        nodes {
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
  }
`;

interface Issue {
  createdAt: string;
  state: "OPEN" | "CLOSED";
  comments: {
    totalCount: number;
  };
  author: {
    login: string;
  };
  title: string;
  number: number;
  id: string;
}
interface RepositoryIssues {
  repository: {
    issues: { nodes: Issue[] };
  };
}

export const IssueList: React.FC<{}> = () => {
  const { loading, error, data } = useQuery<RepositoryIssues>(issuesQuery, {});
  return (
    <div>
      {loading ? (
        <LinearProgress />
      ) : error ? (
        <Error error={error} />
      ) : (
        data &&
        data.repository.issues.nodes.map(
          ({
            id,
            number,
            title,
            state,
            createdAt,
            author: { login: authorLogin },
            comments: { totalCount: totalCommentCount },
          }) => (
            <IssueListItem
              {...{
                number,
                title,
                state,
                createdAt,
                authorLogin,
                totalCommentCount,
              }}
              key={id}
            />
          )
        )
      )}
    </div>
  );
};
