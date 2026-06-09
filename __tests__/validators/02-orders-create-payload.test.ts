import { describe, expect, it } from "vitest";

import { validateCreateOrderInput } from "@/modules/orders/orders.validator";

describe("Order Create Payload Validator", () => {
  it("rechaza payload sin customerName", () => {
    expect(() =>
      validateCreateOrderInput({
        customerName: "",
        customerEmail: "cliente@test.com",
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

  it("rechaza payload sin customerEmail", () => {
    expect(() =>
      validateCreateOrderInput({
        customerName: "Gabriel",
        customerEmail: "",
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

  it("rechaza payload sin total", () => {
    expect(() =>
      validateCreateOrderInput({
        customerName: "Gabriel",
        customerEmail: "cliente@test.com",
        total: undefined as never,
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

  it("aprueba payload válido", () => {
    expect(() =>
      validateCreateOrderInput({
        customerName: "Gabriel",
        customerEmail: "cliente@test.com",
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
});