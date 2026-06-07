import { describe, expect, it } from "vitest";

import { validateUpdatePyme } from "@/modules/platform/platform.validator";

describe("Platform Pyme Suspension Validator", () => {
  it("rechaza suspensión sin suspended_reason", () => {
    const result = validateUpdatePyme({
      status: "suspended",
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain("suspended_reason");
  });

  it("acepta suspensión con motivo válido", () => {
    const result = validateUpdatePyme({
      status: "suspended",
      suspended_reason: "Incumplimiento de términos",
    });

    expect(result.valid).toBe(true);
  });

  it("rechaza status inválido", () => {
    const result = validateUpdatePyme({
      status: "estado_inexistente",
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain("status inválido");
  });
});