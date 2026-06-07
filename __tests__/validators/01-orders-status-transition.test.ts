import { describe, expect, it } from "vitest";

import {
  validateStatusTransition,
  validateCreateOrderInput,
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

  describe("validateCreateOrderInput", () => {
    it("acepta un payload válido", () => {
      expect(() =>
        validateCreateOrderInput({
          customerName: "Gabriel",
          customerEmail: "gabriel@test.com",
          total: 1000,
          items: [
            {
              sku: "SKU001",
              quantity: 1,
              unitPrice: 1000,
            },
          ],
        })
      ).not.toThrow();
    });

    it("rechaza payload sin customerName", () => {
      expect(() =>
        validateCreateOrderInput({
          customerName: "",
          customerEmail: "gabriel@test.com",
          total: 1000,
          items: [
            {
              sku: "SKU001",
              quantity: 1,
              unitPrice: 1000,
            },
          ],
        })
      ).toThrow();
    });
  });
});