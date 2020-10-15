import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import { Container } from "@material-ui/core";

import { Navigation } from "./Navigation";
import { Settings } from "./Settings";
import { Search } from "./Search";
import { IssueList } from "./IssueList";

export const App: React.FC<{}> = () => (
  <Router>
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

const Issue: React.FC<{}> = () => {
  const { issueId } = useParams();

  return <h2>Issue: {issueId}</h2>;
};
