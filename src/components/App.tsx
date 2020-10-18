import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Container } from "@material-ui/core";

import "./app.css";
import { Navigation } from "./Navigation";
import { Settings } from "./Settings";
import { IssueList } from "./IssueList";
import { Issue } from "./Issue";
import { UnauthenticatedError, GithubRepositoryConfigError } from "./Error";

import { useStickyState } from "../helpers";
import { defaultGitHubRepository, githubRepositoryRegex } from "../config";
import { GithubConfig } from "./types";

const AuthWrapper: React.FC<{
  githubConfig: GithubConfig;
}> = ({ githubConfig, children }) => {
  if (!githubConfig.repositoryOwner || !githubConfig.repositoryName) {
    return <GithubRepositoryConfigError />;
  }
  if (!githubConfig.token) {
    return <UnauthenticatedError />;
  }

  return <>{children}</>;
};

export const App: React.FC<{}> = () => {
  const [githubRepositoryUrl, setGithubRepositoryUrl] = useStickyState<string>(
    "githubRepositoryUrl",
    defaultGitHubRepository
  );
  const [githubToken, setGithubToken] = useStickyState<string>(
    "githubToken",
    ""
  );

  const githubRepositoryMatch = githubRepositoryUrl.match(
    githubRepositoryRegex
  );
  const githubConfig: GithubConfig = {
    token: githubToken,
    setToken: setGithubToken,
    repositoryUrl: githubRepositoryUrl,
    setRepositoryUrl: setGithubRepositoryUrl,
    repositoryOwner: githubRepositoryMatch?.groups?.owner,
    repositoryName: githubRepositoryMatch?.groups?.name,
  };

  return (
    <Router
      basename={
        // GitHub pages navigation workaround
        // see https://github.com/rafgraph/spa-github-pages#single-page-apps-for-github-pages
        process.env.NODE_ENV === "production"
          ? "/mms-github-issue-explorer"
          : "/"
      }
    >
      <Navigation />

      <Container maxWidth="md">
        <Switch>
          <Route path="/settings">
            <Settings githubConfig={githubConfig} />
          </Route>
          <Route path="/:issueNumber">
            <AuthWrapper githubConfig={githubConfig}>
              <Issue githubConfig={githubConfig as Required<GithubConfig>} />
            </AuthWrapper>
          </Route>
          <Route path="/">
            <AuthWrapper githubConfig={githubConfig}>
              <IssueList
                githubConfig={githubConfig as Required<GithubConfig>}
              />
            </AuthWrapper>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};
