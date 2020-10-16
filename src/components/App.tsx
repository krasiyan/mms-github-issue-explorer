import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Container } from "@material-ui/core";

import { Navigation } from "./Navigation";
import { Settings } from "./Settings";
import { Search } from "./Search";
import { IssueList } from "./IssueList";
import { Issue } from "./Issue";

export const App: React.FC<{}> = () => (
  <Router
    basename={
      // GitHub pages navigation workaround
      // see https://github.com/rafgraph/spa-github-pages#single-page-apps-for-github-pages
      process.env.NODE_ENV === "production" ? "/mms-github-issue-explorer" : "/"
    }
  >
    <Navigation />

    <Container maxWidth="md">
      <Switch>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/:issueId">
          <Issue />
        </Route>
        <Route path="/">
          <Search />
          <IssueList />
        </Route>
      </Switch>
    </Container>
  </Router>
);
