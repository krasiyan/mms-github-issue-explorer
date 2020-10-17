import React from "react";

import SearchBar from "material-ui-search-bar";

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(2)}px auto`,
      "text-align": "right",
    },
    issueStateFilter: {
      marginTop: theme.spacing(2),
    },
    radioGreen: {
      color: green[400],
      "&$checked": {
        color: green[600],
      },
    },
    radioRed: {
      color: red[400],
      "&$checked": {
        color: red[600],
      },
    },
  })
);

enum IssueStateFilter {
  open = "open",
  closed = "closed",
  both = "both",
}

export const Search: React.FC<{}> = () => {
  const classes = useStyles();

  const [issueStateFilter, setIssueStateFilter] = React.useState<
    IssueStateFilter
  >(IssueStateFilter.both);

  return (
    <div className={classes.root}>
      <SearchBar />
      <FormControl component="fieldset" className={classes.issueStateFilter}>
        <RadioGroup
          row
          aria-label="issueStateFilter"
          name="issueStateFilter"
          value={issueStateFilter}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>): void =>
            setIssueStateFilter(value as IssueStateFilter)
          }
        >
          <FormControlLabel
            value="open"
            control={<Radio color="default" className={classes.radioGreen} />}
            label="Open"
          />
          <FormControlLabel
            value="closed"
            control={<Radio color="default" className={classes.radioRed} />}
            label="Closed"
          />
          <FormControlLabel
            value="both"
            control={<Radio color="default" />}
            label="Both"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};
