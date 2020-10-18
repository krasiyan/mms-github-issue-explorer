export interface GithubConfig {
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  repositoryUrl?: string;
  setRepositoryUrl: React.Dispatch<React.SetStateAction<string>>;
  repositoryOwner?: string;
  repositoryName?: string;
}
