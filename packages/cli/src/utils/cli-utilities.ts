import termSize from "term-size";
import { error, prefix, success } from "@changesets/logger";
import { prompt } from "enquirer";
import { edit } from "external-editor";
import { symbols } from "ansi-colors";

// those types are not exported from `enquirer` so we extract them here
// so we can make type assertions using them because `enquirer` types do no support `prefix` right now
type PromptOptions = Extract<Parameters<typeof prompt>[0], { type: string }>;
type ArrayPromptOptions = Extract<
  PromptOptions,
  {
    type:
      | "autocomplete"
      | "editable"
      | "form"
      | "multiselect"
      | "select"
      | "survey"
      | "list"
      | "scale";
  }
>;
type BooleanPromptOptions = Extract<PromptOptions, { type: "confirm" }>;
type StringPromptOptions = Extract<
  PromptOptions,
  { type: "input" | "invisible" | "list" | "password" | "text" }
>;

/* Notes on using inquirer:
 * Each question needs a key, as inquirer is assembling an object behind-the-scenes.
 * At each call, the entire responses object is returned, so we need a unique
 * identifier for the name every time. This is why we are using serial IDs
 */
const serialId: () => number = (function () {
  let id = 0;
  return () => id++;
})();

const limit = Math.max(termSize().rows - 5, 10);

let cancelFlow = () => {
  success("Cancelled... 👋 ");
  process.exit();
};

async function askCheckboxPlus(
  message: string,
  choices: Array<any>,
  format?: (arg: any) => any
): Promise<Array<string>> {
  const name = `CheckboxPlus-${serialId()}`;

  return prompt({
    type: "autocomplete",
    name,
    message,
    prefix,
    multiple: true,
    choices,
    format,
    limit,
    onCancel: cancelFlow,
    symbols: {
      indicator: symbols.radioOff,
      checked: symbols.radioOn,
    },
    indicator(state: any, choice: any) {
      return choice.enabled ? state.symbols.checked : state.symbols.indicator;
    },
  } as ArrayPromptOptions)
    .then((responses: any) => responses[name])
    .catch((err: unknown) => {
      error(err);
    });
}

async function askQuestion(message: string): Promise<string> {
  const name = `Question-${serialId()}`;

  return prompt([
    {
      type: "input",
      message,
      name,
      prefix,
      onCancel: cancelFlow,
    } as StringPromptOptions,
  ])
    .then((responses: any) => responses[name])
    .catch((err: unknown) => {
      error(err);
    });
}

function askQuestionWithEditor(message: string): string {
  const response = edit(message, { postfix: ".md" });
  return response
    .replace(/^#.*\n?/gm, "")
    .replace(/\n+$/g, "")
    .trim();
}

async function askConfirm(message: string): Promise<boolean> {
  const name = `Confirm-${serialId()}`;

  return prompt([
    {
      message,
      name,
      prefix,
      type: "confirm",
      initial: true,
      onCancel: cancelFlow,
    } as BooleanPromptOptions,
  ])
    .then((responses: any) => responses[name])
    .catch((err: unknown) => {
      error(err);
    });
}

async function askList<Choice extends string>(
  message: string,
  choices: Choice[]
): Promise<Choice> {
  const name = `List-${serialId()}`;

  return prompt([
    {
      choices,
      message,
      name,
      prefix,
      type: "select",
      onCancel: cancelFlow,
    } as ArrayPromptOptions,
  ])
    .then((responses: any) => responses[name])
    .catch((err: unknown) => {
      error(err);
    });
}

export {
  askCheckboxPlus,
  askQuestion,
  askQuestionWithEditor,
  askConfirm,
  askList,
};
