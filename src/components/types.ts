export interface GithubConfig {
  token?: string;
  repositoryUrl?: string;
  repositoryOwner?: string;
  repositoryName?: string;
}

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
export interface RepositoryIssues {
  repository: {
    issues: { nodes: Issue[] };
  };
}
