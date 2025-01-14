export type CliOptions = {
  sinceMaster?: boolean;
  verbose?: boolean;
  output?: string;
  otp?: string;
  empty?: boolean;
  since?: string;
  ignore?: string | string[];
  snapshot?: string | boolean;
  snapshotPrereleaseTemplate?: string;
  noFormatChangesetsWithPrettier?: boolean;
  tag?: string;
  gitTag?: boolean;
  open?: boolean;
};

export type CommandOptions = CliOptions & {
  cwd: string;
};
