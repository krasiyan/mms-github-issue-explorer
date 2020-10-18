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

interface GQLListIssue {
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

export interface GQLListIssues {
  search: {
    nodes: GQLListIssue[];
  };
}

interface GQLIssue extends GQLListIssue {
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

export interface GQLIssueComments {
  repository: {
    issue: {
      id: string;
      comments: {
        nodes: GQLIssueComment[];
      };
    };
  };
}
