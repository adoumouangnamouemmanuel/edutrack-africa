import { describe, expect, it } from "vitest";

import { EDUTRACK_APP_NAME } from "./index";

describe("@edutrack/shared", () => {
  it("exports application name", () => {
    expect(EDUTRACK_APP_NAME).toBe("EduTrack Africa");
  });
});
