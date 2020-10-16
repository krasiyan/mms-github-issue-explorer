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
import { Comment, ErrorOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
      margin: `${theme.spacing(2)}px auto`,
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
  })
);

export const IssueListItem: React.FC<{}> = () => {
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
              <ErrorOutline />
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
                mock issue
              </Typography>
              <Typography className={classes.subTitle} color="textSecondary">
                #111111 opened X days ago by krasiyan
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
              <Typography variant="body2">100</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
