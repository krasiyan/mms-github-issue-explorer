import React from "react";

import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Typography,
} from "@material-ui/core";
import {} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ErrorOutline, CheckCircleOutline, GitHub } from "@material-ui/icons";
import { green, red } from "@material-ui/core/colors";

import { Error } from "./Error";
import { IssueComment } from "./IssueComment";
import { CommentBody } from "./CommentBody";
import { GithubConfig, GQLGetIssue } from "./types";

const issueQuery = gql`
  query GetIssue(
    $githubRepositoryName: String!
    $githubRepositoryOwner: String!
    $issueNumber: Int!
  ) {
    repository(name: $githubRepositoryName, owner: $githubRepositoryOwner) {
      issue(number: $issueNumber) {
        id
        number
        state
        url
        author {
          avatarUrl(size: 40)
          login
          url
        }
        bodyHTML
        createdAt
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    issueStatusChip: {
      color: "white",
      marginLeft: theme.spacing(1),
    },
    issueStatusChipOpen: {
      backgroundColor: green[400],
    },
    issueStatusChipClosed: {
      backgroundColor: red[600],
    },
    issueStatusIcon: {
      color: "white",
    },
  })
);

export const Issue: React.FC<{
  githubConfig: Required<GithubConfig>;
}> = ({ githubConfig }) => {
  const classes = useStyles();

  const { issueNumber: issueNumberParam } = useParams();
  const issueNumber = parseInt(issueNumberParam, 10);

  const { loading, error, data } = useQuery<GQLGetIssue>(issueQuery, {
    variables: {
      githubRepositoryOwner: githubConfig.repositoryOwner,
      githubRepositoryName: githubConfig.repositoryName,
      issueNumber,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Error error={error} />;
  if (!data || !data.repository.issue)
    return (
      <Alert severity="warning">
        <AlertTitle>Issue not found</AlertTitle>
      </Alert>
    );
  const { issue } = data.repository;

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Card variant="outlined">
          <CardHeader
            avatar={
              <Avatar alt={issue.author.login} src={issue.author.avatarUrl}>
                {issue.author.login.substr(0, 1)}
              </Avatar>
            }
            action={
              <IconButton
                aria-label="settings"
                component={Link}
                href={issue.url}
                target="_blank"
                rel="noopener"
                color="primary"
              >
                <Grid container direction="column" alignItems="center">
                  <GitHub />
                  <Typography variant="body2">#{issue.number}</Typography>
                </Grid>
              </IconButton>
            }
            title={issue.title}
            titleTypographyProps={{ variant: "h5" }}
            subheader={
              <Grid container alignItems="center">
                <Typography display="inline">
                  by{" "}
                  <Link href={issue.author.url} target="_blank" rel="noopener">
                    {issue.author.login}
                  </Link>{" "}
                  on {issue.createdAt}
                </Typography>
                {issue.state === "OPEN" ? (
                  <Chip
                    label="Open"
                    size="small"
                    icon={<ErrorOutline className={classes.issueStatusIcon} />}
                    className={`${classes.issueStatusChip} ${classes.issueStatusChipOpen}`}
                  />
                ) : (
                  <Chip
                    label="Closed"
                    size="small"
                    icon={
                      <CheckCircleOutline className={classes.issueStatusIcon} />
                    }
                    className={`${classes.issueStatusChip} ${classes.issueStatusChipClosed}`}
                  />
                )}
              </Grid>
            }
          />
          <CardContent>
            <CommentBody bodyHTML={issue.bodyHTML} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item>
        <IssueComment />
      </Grid>
      <Grid item>
        <IssueComment />
      </Grid>
      <Grid item>
        <IssueComment />
      </Grid>
    </Grid>
  );
};
