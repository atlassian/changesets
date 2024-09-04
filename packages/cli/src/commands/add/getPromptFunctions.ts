import { PromptFunctions } from "@changesets/types";

export const getPromptFunctions = async (
  prompt?: false | readonly [string, any]
): Promise<[PromptFunctions, any]> => {
  if (!prompt) return [{}, null];

  const [promptPath, promptOpts] = prompt;

  const possiblePromptFunctions = await import(promptPath);

  if (!possiblePromptFunctions.default) return [{}, null];

  return [possiblePromptFunctions.default, promptOpts];
};
