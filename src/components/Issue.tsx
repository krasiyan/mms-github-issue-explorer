import React from "react";

import {
  Avatar,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Link,
  Typography,
  Card,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ErrorOutline, GitHub } from "@material-ui/icons";
import { green } from "@material-ui/core/colors";

import { IssueComment } from "./IssueComment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(2)}px auto`,
      padding: theme.spacing(1),
    },
    issueStatusChip: {
      color: "white",
      backgroundColor: green[400],
      marginLeft: theme.spacing(1),
    },
    issueStatusIcon: {
      color: "white",
    },
  })
);

export const Issue: React.FC<{}> = () => {
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Card variant="outlined">
          <CardHeader
            avatar={<Avatar>K</Avatar>}
            action={
              <IconButton aria-label="settings">
                <Grid container direction="column" alignItems="center">
                  <GitHub />
                  <Typography variant="body2">#123123</Typography>
                </Grid>
              </IconButton>
            }
            title="This is a bug"
            titleTypographyProps={{ variant: "h5" }}
            subheader={
              <Grid container alignItems="center">
                <Typography display="inline">
                  by <Link href="https://github.com/krasiyan">krasiyan</Link> on
                  October 16, 2020 19:00 UTC
                </Typography>
                <Chip
                  label="Open"
                  size="small"
                  icon={<ErrorOutline className={classes.issueStatusIcon} />}
                  className={classes.issueStatusChip}
                />
              </Grid>
            }
          />
          <CardContent>
            <Typography variant="body1">mock issue content</Typography>
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
