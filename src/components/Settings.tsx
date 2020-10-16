import React from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Switch,
  TextField,
  FormControl,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "0 auto",
    },
    field: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    fieldRepository: {
      width: "50ch",
    },
    fieldToken: {
      width: "100%",
    },
  })
);

export const Settings: React.FC<{}> = () => {
  const classes = useStyles();
  const [authorizationEnabled, setAuthorizationEnabled] = React.useState<
    boolean
  >(false);
  const [githubRepository, setGithubRepository] = React.useState<string>("");
  const [githubToken, setGithubToken] = React.useState<string>("");

  return (
    <Grid
      container
      item={true}
      md={10}
      wrap="wrap"
      justify="space-between"
      alignItems="flex-end"
      className={classes.root}
    >
      <FormControl className={`${classes.field} ${classes.fieldRepository}`}>
        <TextField
          id="filled-full-width"
          required={true}
          value={githubRepository}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setGithubRepository(e.target.value)
          }
          label="GitHub repository"
          placeholder="https://github.com/facebook/react"
          helperText={<span>Enter the full GitHub repository URL</span>}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormControl>
      <FormControl className={classes.field}>
        <FormLabel component="label">GitHub API authorization</FormLabel>
        <FormControlLabel
          control={
            <Switch
              checked={authorizationEnabled}
              name="authorizationEnabled"
              onChange={({
                target: { checked },
              }: React.ChangeEvent<HTMLInputElement>): void =>
                setAuthorizationEnabled(checked)
              }
            />
          }
          label="Authorized"
        />
        <FormHelperText>
          Authorizing increases the request limits
        </FormHelperText>
      </FormControl>
      {authorizationEnabled && (
        <FormControl className={`${classes.field} ${classes.fieldToken}`}>
          <TextField
            id="filled-full-width"
            label="GitHub personal access token"
            required={true}
            value={githubToken}
            onChange={({
              target: { value },
            }: React.ChangeEvent<HTMLInputElement>): void =>
              setGithubToken(value)
            }
            focused={true}
            autoFocus={true}
            placeholder="token"
            helperText={
              <span>
                Create a personal access token on GitHub with the public_repo
                scope -{" "}
                <Link
                  href="https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token"
                  target="_blank"
                  rel="noopener"
                  color="primary"
                >
                  official guide
                </Link>
              </span>
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      )}
    </Grid>
  );
};
