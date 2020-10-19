import React from "react";
import { cleanup, render } from "@testing-library/react";

import { CommentBody } from "./CommentBody";

describe("CommentBody component", () => {
  afterEach(cleanup);
  test("renders GitHub flavored HTML comment body", () => {
    const { getByText } = render(
      <CommentBody
        bodyHTML={"\
<blockquote> \
<p>test block quote</p> \
</blockquote>"}
      />
    );
    const innerNode = getByText("test block quote");
    expect(innerNode).toBeInTheDocument();
    expect(innerNode.closest("div")).toHaveClass("markdown-body");
  });

  test("sanitizes the bodyHTML string before rendering", () => {
    const { queryByText } = render(
      <CommentBody
        bodyHTML={
          '\
<script>const maliciousElement = document.createElement("div"); maliciousElement.innerHTML = "malicious";</script> \
<blockquote> \
<p>not malicious</p> \
</blockquote>'
        }
      />
    );
    expect(queryByText("malicious")).not.toBeInTheDocument();
    expect(queryByText("not malicious")).toBeInTheDocument();
  });
});
