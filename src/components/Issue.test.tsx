import React from "react";
import { cleanup, render, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import { mockGithubConfig, newTickPromise } from "../fixtures";
import { mockIssue, getGQLMocks } from "./Issue.fixtures";
import { Issue } from "./Issue";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn().mockReturnValue({ issueNumber: "123" }),
}));

describe("Issue component", () => {
  afterEach(cleanup);

  test("open issue without comments", async () => {
    const mocks = getGQLMocks(mockIssue, [], mockGithubConfig);

    await act(async () => {
      const { getByText, getByAltText, getByRole } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Issue githubConfig={mockGithubConfig} />
        </MockedProvider>
      );

      // main comment loaded; discussion comments still loading;
      await newTickPromise();

      expect(getByText("test title")).toBeInTheDocument();
      expect(getByText("#123").closest("a")).toHaveAttribute(
        "href",
        "https://github.com/krasiyan/dotfiles/issues/0"
      );
      expect(getByAltText("krasiyan").closest("img")).toHaveAttribute(
        "src",
        "https://krasiyan.com/me.svg"
      );
      expect(getByText("krasiyan").closest("a")).toHaveAttribute(
        "href",
        "https://github.com/krasiyan"
      );
      expect(getByText("Open")).toBeInTheDocument();
      expect(getByText("test body")).toBeInTheDocument();
      expect(
        getByText((el) => el.includes("2020-10-19T05:00:00Z"))
      ).toBeInTheDocument();
      // comments progress bar still present
      expect(getByRole("progressbar")).toBeInTheDocument();

      // comments query done and progress bar removed
      await newTickPromise();
      expect(getByText("No comments yet")).toBeInTheDocument();
    });
  });

  test("closed issue with two comments", async () => {
    const mocks = getGQLMocks(
      mockIssue,
      [
        {
          id: "commentid1",
          createdAt: "2020-10-19T05:10:00Z",
          author: {
            login: "author1",
            url: "author1url",
            avatarUrl: "author1avatar",
          },
          bodyHTML: "this is the first comment",
        },
        {
          id: "commentid2",
          createdAt: "2020-10-19T05:20:00Z",
          author: {
            login: "author2",
            url: "author2url",
            avatarUrl: "author2avatar",
          },
          bodyHTML: "this is the second comment",
        },
      ],
      mockGithubConfig
    );

    await act(async () => {
      const { getByText, getByAltText } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Issue githubConfig={mockGithubConfig} />
        </MockedProvider>
      );
      // main comment loaded
      await new Promise((resolve) => setTimeout(resolve, 0));
      // discussion comments loaded
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(getByText("this is the first comment")).toBeInTheDocument();
      const firstCommentTimestamp = getByText((el) =>
        el.includes("2020-10-19T05:10:00Z")
      );
      expect(firstCommentTimestamp).toBeInTheDocument();
      expect(getByText("author1").closest("a")).toHaveAttribute(
        "href",
        "author1url"
      );
      expect(getByAltText("author1").closest("img")).toHaveAttribute(
        "src",
        "author1avatar"
      );

      expect(getByText("this is the second comment")).toBeInTheDocument();
      const secondCommentTimestamp = getByText((el) =>
        el.includes("2020-10-19T05:20:00Z")
      );
      expect(secondCommentTimestamp).toBeInTheDocument();
      expect(getByText("author2").closest("a")).toHaveAttribute(
        "href",
        "author2url"
      );
      expect(getByAltText("author2").closest("img")).toHaveAttribute(
        "src",
        "author2avatar"
      );
    });
  });
});
