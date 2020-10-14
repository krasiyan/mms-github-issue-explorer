import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import "./App.css";

export const App: React.FC<{}> = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Issues</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

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
      </div>
    </Router>
  );
};
const IssueList: React.FC<{}> = () => <h2>Issue list</h2>;
const Issue: React.FC<{}> = () => {
  const { issueId } = useParams();

  return <h2>Issue: {issueId}</h2>;
};
const Settings: React.FC<{}> = () => <h2>Settings</h2>;
