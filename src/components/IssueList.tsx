import React from "react";

import { IssueListItem } from "./IssueListItem";

export const IssueList: React.FC<{}> = () => {
  return (
    <div>
      <IssueListItem />
      <IssueListItem />
      <IssueListItem />
      <IssueListItem />
    </div>
  );
};
