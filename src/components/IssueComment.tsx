import React from "react";

import {
  Avatar,
  CardContent,
  CardHeader,
  Link,
  Typography,
  Card,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: theme.spacing(3),
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

export const IssueComment: React.FC<{}> = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        avatar={<Avatar className={classes.avatar}>K</Avatar>}
        titleTypographyProps={{ variant: "h5" }}
        subheader={
          <span>
            <Link href="https://github.com/krasiyan">krasiyan</Link> on October
            16, 2020 19:00 UTC
          </span>
        }
        className={classes.header}
      />
      <CardContent>
        <Typography variant="body1">mock issue comment</Typography>
      </CardContent>
    </Card>
  );
};
