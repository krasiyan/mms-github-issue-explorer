import React from "react";

import htmlParser from "html-react-parser";
import DOMPurify from "dompurify";

import "github-markdown-css";

export const CommentBody: React.FC<{
  bodyHTML: string;
}> = ({ bodyHTML }) => {
  return (
    <div className="markdown-body">
      {htmlParser(DOMPurify.sanitize(bodyHTML))}
    </div>
  );
};
