export interface GithubConfig {
  token?: string;
  repositoryUrl?: string;
  repositoryOwner?: string;
  repositoryName?: string;
}

interface GQLListIssue {
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

export interface GQLListIssues {
  search: {
    nodes: GQLListIssue[];
  };
}

interface GQLIssue extends GQLListIssue {
  url: string;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  bodyHTML: string;
}

export interface GQLGetIssue {
  repository: {
    issue: GQLIssue;
  };
}
