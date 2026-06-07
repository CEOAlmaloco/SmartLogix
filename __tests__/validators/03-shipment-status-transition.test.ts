import { describe, expect, it } from "vitest";

import { validateShipmentTransition } from "@/modules/shipments/shipments.validator";

describe("Shipment Status Transition Validator", () => {
  it("permite pending -> in_transit", () => {
    expect(() =>
      validateShipmentTransition("pending", "in_transit")
    ).not.toThrow();
  });

  it("rechaza delivered -> pending", () => {
    expect(() =>
      validateShipmentTransition("delivered", "pending")
    ).toThrow();
  });

  it("rechaza cancelled -> in_transit", () => {
    expect(() =>
      validateShipmentTransition("cancelled", "in_transit")
    ).toThrow();
  });
});