import { describe, expect, it } from "vitest";

import {
  validateStatusTransition,
} from "@/modules/orders/orders.validator";

describe("Orders Validator", () => {
  describe("validateStatusTransition", () => {
    it("permite pending -> approved", () => {
      expect(() =>
        validateStatusTransition("pending", "approved")
      ).not.toThrow();
    });

    it("rechaza pending -> dispatched", () => {
      expect(() =>
        validateStatusTransition("pending", "dispatched")
      ).toThrow();
    });

    it("rechaza dispatched -> pending", () => {
      expect(() =>
        validateStatusTransition("dispatched", "pending")
      ).toThrow();
    });
  });
});