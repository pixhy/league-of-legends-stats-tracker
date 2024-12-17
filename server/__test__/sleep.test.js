import { afterAll, beforeAll, expect, jest } from "@jest/globals";
import sleep from "../utils/sleep";

describe("sleep function", () => {
  test("should wait for the specified time", async () => {
    const ms = 1000;

    const startTime = Date.now();
    await sleep(ms);
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(ms);
  });
});
