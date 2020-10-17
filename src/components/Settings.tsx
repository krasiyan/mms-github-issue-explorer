import React from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Link, TextField, FormControl } from "@material-ui/core";

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
      width: "100%",
    },
  })
);

interface GithubSettingsTextFieldProps {
  fieldName: string;
  fieldDefaultValue: string;
  fieldRegex: RegExp;
  id: string;
  label: string;
  placeholder: string;
  helperText: React.ReactNode;
  helperTextError?: React.ReactNode;
}

const GithubSettingsTextField: React.FC<GithubSettingsTextFieldProps> = ({
  fieldName,
  fieldDefaultValue,
  fieldRegex,
  id,
  label,
  placeholder,
  helperText,
  helperTextError,
}) => {
  const classes = useStyles();

  const [value, setValue] = useStickyState<string>(
    fieldName,
    fieldDefaultValue
  );
  const isValid = (): boolean => fieldRegex.test(value);
  const [isTouched, setTouched] = React.useState<boolean>(false);

  return (
    <FormControl error={isTouched && !isValid()} className={classes.field}>
      <TextField
        id={id}
        required={true}
        error={isTouched && !isValid()}
        value={value}
        onChange={({
          target: { value: newValue },
        }: React.ChangeEvent<HTMLInputElement>): void => setValue(newValue)}
        onFocus={(): void => setTouched(true)}
        label={label}
        placeholder={placeholder}
        helperText={
          isTouched && !isValid() ? helperTextError || helperText : helperText
        }
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ spellCheck: "false" }}
      />
    </FormControl>
  );
};

export const Settings: React.FC<{}> = () => {
  const classes = useStyles();

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
        <GithubSettingsTextField
          fieldName="githubRepository"
          fieldDefaultValue={defaultGitHubRepository}
          fieldRegex={githubRepositoryRegex}
          id="githubRepository"
          label="GitHub repository"
          placeholder={defaultGitHubRepository}
          helperText={<span>Enter the full GitHub repository URL</span>}
          helperTextError={
            <span>
              Invalid GitHub repository - use the following format:
              <br />
              <strong>{defaultGitHubRepository}</strong>
            </span>
          }
        />

        <GithubSettingsTextField
          fieldName="githubToken"
          fieldDefaultValue={defaultGitHubRepository}
          fieldRegex={new RegExp("(.+)")}
          id="githubToken"
          label="GitHub personal access token"
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
        />
      </Grid>
    </form>
  );
};
