import { log } from "@changesets/logger";
import { silenceLogsInBlock } from "./";

describe("temporarilySilenceLogs", () => {
  silenceLogsInBlock();

  let originalConsoleLog = console.log;
  beforeEach(() => {
    console.log = jest.fn();
  });
  afterEach(() => {
    console.log = originalConsoleLog;
  });
  it("should not call console.log", () => {
    log("Log message");
    expect(console.log).not.toHaveBeenCalled();
  });
});
