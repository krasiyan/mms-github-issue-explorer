import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import { Container } from "@material-ui/core";

import { Navigation } from "./Navigation";

export const App: React.FC<{}> = () => (
  <Router>
    <Navigation />

    <Container maxWidth="md">
      <Switch>
        <Route path="/:issueId">
          <Issue />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/">
          <IssueList />
        </Route>
      </Switch>
    </Container>
  </Router>
);

const IssueList: React.FC<{}> = () => <h2>Issue list</h2>;
const Issue: React.FC<{}> = () => {
  const { issueId } = useParams();

  return <h2>Issue: {issueId}</h2>;
};
const Settings: React.FC<{}> = () => <h2>Settings</h2>;
