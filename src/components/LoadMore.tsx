import React from "react";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      "text-align": "center",
    },
  })
);

export const LoadMore: React.FC<{
  loadMore: () => void;
}> = ({ loadMore }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab
        size="medium"
        color="primary"
        variant="extended"
        onClick={(): void => loadMore()}
      >
        <MoreHoriz />
        Load more
      </Fab>
    </div>
  );
};
