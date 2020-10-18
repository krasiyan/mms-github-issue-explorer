import React from "react";

import {
  Avatar,
  CardContent,
  CardHeader,
  Link,
  Card,
  Grid,
  Chip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ErrorOutline, CheckCircleOutline, GitHub } from "@material-ui/icons";
import { green, red } from "@material-ui/core/colors";

import { CommentBody } from "./CommentBody";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
    },
    header: {
      "& > .MuiCardHeader-avatar": {
        marginRight: theme.spacing(1),
      },
    },
    avatarRoot: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    avatarComment: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
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

interface IssueCommentProps {
  isRootComment: boolean;
  issueNumber?: number;
  issueStatus?: "OPEN" | "CLOSED";
  issueTitle?: string;
  issueUrl?: string;
  createdAt: string;
  authorLogin: string;
  authorUrl: string;
  authorAvatarUrl: string;
  bodyHTML: string;
}

export const IssueComment: React.FC<IssueCommentProps> = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        avatar={
          <Avatar
            alt={props.authorLogin}
            src={props.authorAvatarUrl}
            className={
              props.isRootComment ? classes.avatarRoot : classes.avatarComment
            }
          >
            {props.authorLogin.substr(0, 1)}
          </Avatar>
        }
        title={props.isRootComment ? props.issueTitle : undefined}
        titleTypographyProps={{ variant: "h5" }}
        subheader={
          <Grid container alignItems="center">
            <span>
              <Link href={props.authorUrl} target="_blank" rel="noopener">
                {props.authorLogin}
              </Link>{" "}
              on {props.createdAt}
            </span>
            {props.isRootComment && props.issueStatus === "OPEN" ? (
              <Chip
                label="Open"
                size="small"
                icon={<ErrorOutline className={classes.issueStatusIcon} />}
                className={`${classes.issueStatusChip} ${classes.issueStatusChipOpen}`}
              />
            ) : props.issueStatus === "CLOSED" ? (
              <Chip
                label="Closed"
                size="small"
                icon={
                  <CheckCircleOutline className={classes.issueStatusIcon} />
                }
                className={`${classes.issueStatusChip} ${classes.issueStatusChipClosed}`}
              />
            ) : undefined}
          </Grid>
        }
        action={
          props.isRootComment ? (
            <IconButton
              aria-label="settings"
              component={Link}
              href={props.issueUrl}
              target="_blank"
              rel="noopener"
              color="primary"
            >
              <Grid container direction="column" alignItems="center">
                <GitHub />
                <Typography variant="body2">#{props.issueNumber}</Typography>
              </Grid>
            </IconButton>
          ) : undefined
        }
        className={classes.header}
      />
      <CardContent>
        <CommentBody bodyHTML={props.bodyHTML} />
      </CardContent>
    </Card>
  );
};
