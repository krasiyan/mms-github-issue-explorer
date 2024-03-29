#!/bin/bash
set -eo pipefail

# builds and deploys the application

if [ -n "$CI" ]; then
  DEPLOYMENT_METHOD="ci"
else
  DEPLOYMENT_METHOD="manual"
fi

if [ $DEPLOYMENT_METHOD = "ci" ]; then
  if [ -z $GITHUB_TOKEN ]; then echo 'The $GITHUB_TOKEN env. varible is missing.'; exit 1; fi
  if [ -z $GITHUB_SHA ]; then echo 'The $GITHUB_SHA env. varible is missing.'; exit 1; fi
fi


npm run build
./node_modules/.bin/gh-pages-clean

if [ $DEPLOYMENT_METHOD = "ci" ]; then
  CI_DEPLOY_REPO="https://x-access-token:${GITHUB_TOKEN}@github.com/krasiyan/mms-github-issue-explorer.git"
  CI_DEPLOY_USER="GitHub Action <action@github.com>"
  CI_DEPLOY_MESSAGE="CI build for ${GITHUB_SHA}"

  ./node_modules/.bin/gh-pages -d build -x -m "${CI_DEPLOY_MESSAGE}" -u "${CI_DEPLOY_USER}" -r "${CI_DEPLOY_REPO}"
else
  MANUAL_DEPLOY_MESSAGE="manual build for `git rev-parse HEAD`"
  ./node_modules/.bin/gh-pages -d build -m "${MANUAL_DEPLOY_MESSAGE}"
fi

exit 0
