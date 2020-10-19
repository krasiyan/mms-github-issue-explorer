export interface Author {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface PageInfo {
  startCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  endCursor: string;
}

export enum IssueState {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface IssuePreview {
  createdAt: string;
  state: IssueState;
  comments: {
    totalCount: number;
  };
  author: Pick<Author, "login">;
  title: string;
  number: number;
  id: string;
}

export interface Issue extends Omit<IssuePreview, "comments"> {
  url: string;
  author: Author;
  bodyHTML: string;
}
