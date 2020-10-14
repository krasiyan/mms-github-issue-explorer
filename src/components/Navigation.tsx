import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import { AppBar, Button, Toolbar, Typography, Grid } from "@material-ui/core";
import { Settings, GitHub } from "@material-ui/icons";

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      color: "#fff",
    },
    title: {
      "text-transform": "none",
    },
  })
);

export const Navigation: React.FC<{}> = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Grid justify="space-between" alignItems="center" container>
          <Grid item>
            <Button
              aria-label="home"
              component={RouterLink}
              to="/"
              color="inherit"
              startIcon={<GitHub fontSize="small" />}
            >
              <Typography variant="h6" className={classes.title}>
                MMS GitHub Issue Explorer
              </Typography>
            </Button>
          </Grid>

          <Grid item>
            <Button
              component={RouterLink}
              to="/settings"
              endIcon={<Settings />}
              color="inherit"
            >
              Settings
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
