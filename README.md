[![](https://github.com/krasiyan/mms-github-issue-explorer/workflows/cicd/badge.svg)](https://krasiyan.com/mms-github-issue-explorer/)

# MediaMarktSaturn challenge - GitHub issue explorer

# Resources

- [requirements PDF](./requirements.pdf)
- [GitHub GraphQL API](https://docs.github.com/en/free-pro-team@latest/graphql)
- [GitHub GraphQL API Explorer](https://developer.github.com/v4/explorer/)
- [React repository](https://github.com/facebook/react)

# GitHub pages deployment

https://krasiyan.com/mms-github-issue-explorer/

The application is automatically built from the `master` branch on every push and hosted on GitHub pages (build resides at the [gh-pages](https://github.com/krasiyan/mms-github-issue-explorer/tree/gh-pages) branch).

# Development setup

Node 12 LTS (>=12.19.0) must be installed along with a recent NPM (>=6.14.8) (hint: [nvm](https://github.com/nvm-sh/nvm))

Development commands:

```bash
npm start            # starts the React dev server @ http://localhost:3000
npm test             # run all tests
npm run build        # build application (in /build)
npm run builddeploy  # build application and publish it to GitHub pages
npm run check:types  # check TypeScript types via tsc
npm run check:lint   # check codestyle via ESLint
npm run check:format # check code formatting via Prettier
npm run check        # run all checkers
```

:information_source: By default a local Git hook is added by `npm` (via [`husky`](https://www.npmjs.com/package/husky)) in order to [lint/standardize the commit messages](https://www.conventionalcommits.org/) (via [`commitlint`](https://commitlint.js.org/)).

# Components breakdown

- [`App`](./src/components/App.tsx) - Instantiates the Apollo client, React router and defines the router paths (for `Settings`, `Issue` and `IssueList`). Instantiates the GitHub configuration and persists it in the local storage.
- [`CommentBody`](./src/components/CommentBody.tsx) - Sanitizes and renders an HTML comment string with a style similar to GitHub's.
- [`Error`](./src/components/Error.tsx) - Renders an error message with some branching logic for common Apollo/GraphQL errors.
- [`Issue`](./src/components/Issue.tsx) - Renders a single issue along with its comments. Uses the `GetIssue` GQL query for the main issue. Renders the main/root level comment via `IssueComment` and the discussion comments via `IssueCommentList`.
- [`IssueComment`](./src/components/IssueComment.tsx) - Renders a single issue comment (either the root/main one or a discussion comments). Uses `CommentBody` to render the comment content.
- [`IssueCommentList`](./src/components/IssueCommentList.tsx) - Reuses the `IssueComment` to render the discussion comments for an issue based on the `GetIssueComments` GQL query. Supports loading additional comments via `LoadMore`.
- [`IssueList`](./src/components/IssueList.tsx) - Renders the `Search` component and multiple `IssueListItem`s. Uses the `SearchIssues` GQL query and feeds it with the parameters from `Search`. Supports loading additional issues via `LoadMore`. Supports polling for newer issues on the defined search criteria (based on [`./src/config.ts`](./src/config.ts)'s `graphQLPollingInterval`).
- [`IssueListItem`](./src/components/IssueListItem.tsx) - Renders a single issue preview.
- [`LoadMore`](./src/components/LoadMore.tsx) - Renders a button for loading additional results.
- [`Navigation`](./src/components/Navigation.tsx) - Renders the top navbar with links to the main route (`/`) as well as (`/settings`).
- [`Search`](./src/components/Search.tsx) - Renders a search box as well as issue state filter (radio buttons).
- [`Settings`](./src/components/Settings.tsx) - Renders the GitHub settings fields (repository URL and GitHub personal access token).

# Potential improvements

- The tests should be extended to cover error cases as well as the pagination/load more mechanism
- Use https://graphql-code-generator.com/ to eliminate the manual GraphQL schema + type management. All GraphQL queries will be moved to standalone files and `useEffect` style query methods will be auto-generated. "Continuous/regular" CI schema building can be set up in order to easily see when/if the GitHub GraphQL schema changes.
- GraphQL cache optimization:
  - Potentially persist GraphQL's cache (polling or other refresh policies might have to be applied)
- Misc UI/UX improvements:
  - add more links to GitHub (i.e. for individual comments)
  - comment date formatting
- Potentially add "classical" pagination to the issue list
- Improve the `IssueList` polling mechanism so that it only polls for the delta (new comments) using the `after` relay style GraphQL parameter

# License

[MIT](./LICENSE.md)
