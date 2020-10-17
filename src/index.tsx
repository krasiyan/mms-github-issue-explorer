import React from "react";
import ReactDOM from "react-dom";

import { App } from "./components/App";

import { ApolloProvider } from "@apollo/client";

import { createApolloClient } from "./apollo";

const apolloClient = createApolloClient();

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
