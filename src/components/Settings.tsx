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

import { defaultGitHubRepository, githubRepositoryRegex } from "../config";
import { useStickyState } from "../helpers";

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

  const [authorizationEnabled, setAuthorizationEnabled] = useStickyState<
    boolean
  >("authorizationEnabled", false);

  const [githubRepository, setGithubRepository] = useStickyState<string>(
    "githubRepository",
    defaultGitHubRepository
  );
  const isGithubRepositoryValid = (): boolean =>
    githubRepositoryRegex.test(githubRepository);
  const [
    isGithubRepositoryTouched,
    setGithubRepositoryTouched,
  ] = React.useState<boolean>(false);

  const [githubToken, setGithubToken] = useStickyState<string>(
    "githubToken",
    ""
  );
  const isGithubTokenValid = (): boolean => {
    return githubToken.length > 0;
  };
  const [isGithubTokenTouched, setGithubTokenTouched] = React.useState<boolean>(
    false
  );

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid
        container
        item={true}
        md={10}
        wrap="wrap"
        justify="space-between"
        alignItems="flex-end"
      >
        <FormControl
          error={isGithubRepositoryTouched && !isGithubRepositoryValid()}
          className={`${classes.field} ${classes.fieldRepository}`}
        >
          <TextField
            id="githubRepository"
            required={true}
            error={isGithubRepositoryTouched && !isGithubRepositoryValid()}
            value={githubRepository}
            onChange={({
              target: { value: newGithubRepository },
            }: React.ChangeEvent<HTMLInputElement>): void =>
              setGithubRepository(newGithubRepository)
            }
            onBlur={(): void => setGithubRepositoryTouched(true)}
            label="GitHub repository"
            placeholder={defaultGitHubRepository}
            helperText={
              isGithubRepositoryTouched && !isGithubRepositoryValid() ? (
                <span>Enter the full GitHub repository URL</span>
              ) : (
                <span>
                  Invalid GitHub repository - use the following format:
                  <br />
                  <strong>{defaultGitHubRepository}</strong>
                </span>
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ spellCheck: "false" }}
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
          <FormControl
            error={isGithubTokenTouched && !isGithubTokenValid()}
            className={`${classes.field} ${classes.fieldToken}`}
          >
            <TextField
              id="authorizationEnabled"
              label="GitHub personal access token"
              required={true}
              error={isGithubTokenTouched && !isGithubTokenValid()}
              value={githubToken}
              onChange={({
                target: { value },
              }: React.ChangeEvent<HTMLInputElement>): void => {
                setGithubToken(value);
              }}
              onBlur={(): void => setGithubTokenTouched(true)}
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
              inputProps={{ spellCheck: "false" }}
            />
          </FormControl>
        )}
      </Grid>
    </form>
  );
};
