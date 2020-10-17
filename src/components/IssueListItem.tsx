import React from "react";

import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import { Comment, ErrorOutline, CheckCircleOutline } from "@material-ui/icons";
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
      margin: `0px auto ${theme.spacing(2)}px auto`,
    },
    cardContent: {
      paddingLeft: 0,
      paddingRight: 0,
      "&:last-child": {
        paddingBottom: theme.spacing(2),
      },
    },
    subTitle: {
      fontSize: 12,
    },
    issueOpenIcon: {
      color: green[400],
    },
    issueClosedIcon: {
      color: red[600],
    },
  })
);

interface IssueProps {
  number: number;
  title: string;
  state: "OPEN" | "CLOSED";
  createdAt: string;
  authorLogin: string;
  totalCommentCount: number;
}

export const IssueListItem: React.FC<IssueProps> = ({
  number,
  title,
  state,
  createdAt,
  authorLogin,
  totalCommentCount,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardActionArea component={RouterLink} to="/123">
        <CardContent className={classes.cardContent}>
          <Grid container justify="space-between" alignItems="stretch">
            <Grid
              item
              xs={2}
              md={1}
              container
              alignItems="center"
              justify="center"
            >
              {state === "OPEN" ? (
                <ErrorOutline className={classes.issueOpenIcon} />
              ) : (
                <CheckCircleOutline className={classes.issueClosedIcon} />
              )}
            </Grid>
            <Grid
              item
              xs={8}
              md={10}
              container
              justify="space-around"
              alignItems="flex-start"
              direction="column"
            >
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
              <Typography className={classes.subTitle} color="textSecondary">
                #{number} opened on {createdAt} by {authorLogin}
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              md={1}
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Comment />
              <Typography variant="body2">{totalCommentCount}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
