import React from "react";

import { useReactiveVar } from "@apollo/client";
import SearchBar from "material-ui-search-bar";

import { issueTextFilter, issueStateFilter } from "../apollo";
import { IssueStateFilter } from "../types";

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
      margin: `0 auto`,
      "text-align": "right",
    },
    issueStateFilter: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    radioGreen: {
      color: green[400],
    },
    radioRed: {
      color: red[400],
    },
  })
);

export const Search: React.FC<{}> = () => {
  const classes = useStyles();

  const [currentSearchValue, setCurrentSearchValue] = React.useState<string>(
    ""
  );

  return (
    <div className={classes.root}>
      <SearchBar
        cancelOnEscape={true}
        value={useReactiveVar(issueTextFilter)}
        onChange={(value): void => {
          setCurrentSearchValue(value);
          // trigger the filter change is the field is wiped out
          if (!value) issueTextFilter("");
        }}
        onRequestSearch={(): void => {
          issueTextFilter(currentSearchValue);
        }}
        onCancelSearch={(): void => {
          issueTextFilter("");
          setCurrentSearchValue("");
        }}
      />
      <FormControl component="fieldset" className={classes.issueStateFilter}>
        <RadioGroup
          row
          aria-label="issueStateFilter"
          name="issueStateFilter"
          value={useReactiveVar(issueStateFilter)}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>): void => {
            issueStateFilter(value as IssueStateFilter);
          }}
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
