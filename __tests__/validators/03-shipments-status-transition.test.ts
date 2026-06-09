import { describe, expect, it } from "vitest";

import {
  ensureValidShipmentStatus,
  validateShipmentCanDelete,
  validateShipmentTransition,
} from "@/modules/shipments/shipments.validator";

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

  it("rechaza un status invalido", () => {
    expect(() => ensureValidShipmentStatus("estado_inexistente")).toThrow(
      /Status de envio invalido/
    );
  });

  it("rechaza eliminar un envio en estado in_transit", () => {
    expect(() => validateShipmentCanDelete("in_transit")).toThrow(
      /Solo se puede eliminar/
    );
  });
});