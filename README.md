[![](https://github.com/krasiyan/mms-github-issue-explorer/workflows/cicd/badge.svg)](https://krasiyan.com/mms-github-issue-explorer/)

# MMS GitHub issue explorer

# Resources

- [GitHub GraphQL API](https://docs.github.com/en/free-pro-team@latest/graphql)
- [GitHub GraphQL API Explorer](https://developer.github.com/v4/explorer/)
- [React repository](https://github.com/facebook/react)

# Development setup

Node 12 LTS (>=12.19.0) must be installed along with a recent NPM (>=6.14.8) (hint: [nvm](https://github.com/nvm-sh/nvm))

Development commands:

```bash
npm start            # starts the React dev server @ http://localhost:3000
npm test             # run all tests
npm run build        # build application (in /build)
npm run check:types  # check TypeScript types via tsc
npm run check:lint   # check codestyle via ESLint
npm run check:format # check code formatting via Prettier
npm run check        # run all checkers
```

:information_source: By default a local Git hook is added by `npm` (via [`husky`](https://www.npmjs.com/package/husky)) in order to [lint/standardize the commit messages](https://www.conventionalcommits.org/) (via [`commitlint`](https://commitlint.js.org/)).

# License

[MIT](./LICENSE.md)
