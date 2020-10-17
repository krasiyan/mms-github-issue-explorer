import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Alert, AlertTitle } from "@material-ui/lab";
import { Link, Typography } from "@material-ui/core";

import { ApolloError } from "@apollo/client";
import { repository as packageRepository } from "../../package.json";

const ErrorDetails: React.FC<{ details: string }> = ({ details }) => (
  <div>
    <br />
    <Typography variant="subtitle2">Error details:</Typography>
    <Typography variant="overline">{details}</Typography>
  </div>
);

const UnauthenticatedError: React.FC<{}> = () => (
  <Alert severity="warning">
    <AlertTitle>Missing GitHub access token</AlertTitle>
    Please provide a GitHub personal access token in the{" "}
    <RouterLink to="/settings">settings page</RouterLink>.
  </Alert>
);

const BadCredentialsError: React.FC<{}> = () => (
  <Alert severity="error">
    <AlertTitle>Invalid GitHub access token</AlertTitle>
    Please make sure you have the correct GitHub personal access token it in the{" "}
    <RouterLink to="/settings">settings</RouterLink> and that it has the
    required scopes (i.e public_repo).
  </Alert>
);

const GraphQLError: React.FC<{ details: string }> = ({ details }) => (
  <Alert severity="error">
    <AlertTitle>GraphQL error</AlertTitle>A GraphQL error has occured - please
    make sure that the schema is up to date and that the{" "}
    <Link
      href={`${packageRepository.url}/actions`}
      target="_blank"
      rel="noopener"
      color="primary"
    >
      project's CI pipeline
    </Link>{" "}
    is passing.
    <ErrorDetails details={details} />
  </Alert>
);

const OtherError: React.FC<{ details: string }> = ({ details }) => (
  <Alert severity="error">
    <AlertTitle>An unknown error has occured</AlertTitle>
    Please try again or open an issue in the{" "}
    <Link
      href={packageRepository.url}
      target="_blank"
      rel="noopener"
      color="primary"
    >
      project's repository
    </Link>
    <ErrorDetails details={details} />
  </Alert>
);

export const GithubRepositoryConfigError: React.FC<{}> = () => (
  <Alert severity="error">
    <AlertTitle>Invalid GitHub repository</AlertTitle>
    Please set a valid repository URL in the{" "}
    <RouterLink to="/settings">settings</RouterLink>
  </Alert>
);

export const Error: React.FC<{ error: ApolloError }> = ({ error }) => {
  if (error.graphQLErrors.length > 0) {
    return <GraphQLError details={error.message} />;
  }

  if (error.networkError && "statusCode" in error.networkError) {
    if (error.networkError.statusCode === 401) {
      return "result" in error.networkError &&
        error.networkError.result?.message === "Bad credentials" ? (
        <BadCredentialsError />
      ) : (
        <UnauthenticatedError />
      );
    }
  }

  return <OtherError details={error.message} />;
};
