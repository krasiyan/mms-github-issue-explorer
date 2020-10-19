import { GithubConfig } from "./types";

export const mockGithubConfig: Required<GithubConfig> = {
  token: "mocktoken",
  setToken: jest.fn(),
  repositoryUrl: "mocurl",
  setRepositoryUrl: jest.fn(),
  repositoryOwner: "owner",
  repositoryName: "name",
};

export const newTickPromise = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0));
