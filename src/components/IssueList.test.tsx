import React from "react";
import { cleanup, render, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";

import { mockGithubConfig, newTickPromise } from "../fixtures";
import { getGQLMocks, mockIssuePreview } from "./IssueList.fixtures";

import { IssueList } from "./IssueList";

describe("IssueList component", () => {
  afterEach(cleanup);
  test("empty issue list", async () => {
    const mocks = getGQLMocks(
      `repo:${mockGithubConfig.repositoryOwner}/${mockGithubConfig.repositoryName} is:issue sort:created `,
      []
    );

    await act(async () => {
      const { getByText, getByPlaceholderText, getByRole } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <IssueList githubConfig={mockGithubConfig} />
        </MockedProvider>
      );
      await newTickPromise();

      expect(getByPlaceholderText("Search")).toBeInTheDocument();
      expect(getByRole("radiogroup")).toBeInTheDocument();
      expect(getByText("No issues found")).toBeInTheDocument();
    });
  });

  test("single issue in list", async () => {
    const mocks = getGQLMocks(
      `repo:${mockGithubConfig.repositoryOwner}/${mockGithubConfig.repositoryName} is:issue sort:created `,
      [mockIssuePreview]
    );

    await act(async () => {
      const { getByText, getByPlaceholderText, getByRole } = render(
        <MockedProvider mocks={mocks} addTypename={true}>
          <Router>
            <IssueList githubConfig={mockGithubConfig} />
          </Router>
        </MockedProvider>
      );
      await newTickPromise();

      expect(getByPlaceholderText("Search")).toBeInTheDocument();
      expect(getByRole("radiogroup")).toBeInTheDocument();

      const previewTitle = getByText("test title");
      expect(previewTitle).toBeInTheDocument();
      expect(previewTitle.closest("a")).toHaveAttribute("href", "/123");

      expect(
        getByText("#123 opened on 2020-10-19T05:00:00Z by krasiyan")
      ).toBeInTheDocument();
    });
  });
});
