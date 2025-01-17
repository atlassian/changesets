import { NewChangeset } from "@changesets/types";

export type RelevantChangesets = {
  major: NewChangeset[];
  minor: NewChangeset[];
  patch: NewChangeset[];
};

export type ChangelogEntry = {
  title: string;
  body: string;
} | null;
