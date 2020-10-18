export interface GithubConfig {
  token?: string;
  repositoryUrl?: string;
  repositoryOwner?: string;
  repositoryName?: string;
}

interface Author {
  login: string;
  avatarUrl: string;
  url: string;
}

interface PageInfo {
  startCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  endCursor: string;
}

interface GQLSearchIssue {
  createdAt: string;
  state: "OPEN" | "CLOSED";
  comments: {
    totalCount: number;
  };
  author: Pick<Author, "login">;
  title: string;
  number: number;
  id: string;
}

interface GQLSearchIssueEdge {
  node: GQLSearchIssue;
}

export interface GQLSearchIssues {
  search: {
    edges: GQLSearchIssueEdge[];
    pageInfo: PageInfo;
  };
}

interface GQLIssue extends GQLSearchIssue {
  url: string;
  author: Author;
  bodyHTML: string;
}

export interface GQLGetIssue {
  repository: {
    issue: GQLIssue;
  };
}

interface GQLIssueComment {
  id: string;
  createdAt: string;
  author: Author;
  bodyHTML: string;
}

interface GQLIssueCommentEdge {
  node: GQLIssueComment;
}

export interface GQLIssueComments {
  repository: {
    issue: {
      id: string;
      comments: {
        edges: GQLIssueCommentEdge[];
        pageInfo: PageInfo;
      };
    };
  };
}
