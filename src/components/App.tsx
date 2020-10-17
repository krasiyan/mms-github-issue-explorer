import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Container } from "@material-ui/core";

import "./app.css";
import { Navigation } from "./Navigation";
import { Settings } from "./Settings";
import { IssueList } from "./IssueList";
import { Issue } from "./Issue";
import { UnauthenticatedError, GithubRepositoryConfigError } from "./Error";

import { readKeyFromLocalStorage } from "../helpers";
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
  const githubRepositoryUrl = readKeyFromLocalStorage(
    "githubRepository",
    defaultGitHubRepository
  );
  const githubRepositoryMatch = githubRepositoryUrl.match(
    githubRepositoryRegex
  );

  const githubConfig: GithubConfig = {
    token: readKeyFromLocalStorage("githubToken", undefined),
    repositoryUrl: githubRepositoryUrl,
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
            <Settings />
          </Route>
          <Route path="/:issueId">
            <AuthWrapper githubConfig={githubConfig}>
              <Issue />
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
