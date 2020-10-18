import React from "react";

import { Avatar, CardContent, CardHeader, Link, Card } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { CommentBody } from "./CommentBody";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    header: {
      "& > .MuiCardHeader-avatar": {
        marginRight: theme.spacing(1),
      },
    },
    avatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  })
);

export const IssueComment: React.FC<{
  createdAt: string;
  authorLogin: string;
  authorUrl: string;
  authorAvatarUrl: string;
  bodyHTML: string;
}> = ({ createdAt, authorLogin, authorUrl, authorAvatarUrl, bodyHTML }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        avatar={
          <Avatar
            alt={authorLogin}
            src={authorAvatarUrl}
            className={classes.avatar}
          >
            {authorLogin.substr(0, 1)}
          </Avatar>
        }
        titleTypographyProps={{ variant: "h5" }}
        subheader={
          <span>
            <Link href={authorUrl} target="_blank" rel="noopener">
              {authorLogin}
            </Link>{" "}
            on {createdAt}
          </span>
        }
        className={classes.header}
      />
      <CardContent>
        <CommentBody bodyHTML={bodyHTML} />
      </CardContent>
    </Card>
  );
};
