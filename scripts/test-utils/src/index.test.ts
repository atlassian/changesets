import { log } from "@changesets/logger";
import { silenceLogsInBlock } from "./index.ts";

describe("temporarilySilenceLogs", () => {
  silenceLogsInBlock();
  describe("log", () => {
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
});
