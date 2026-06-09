import { describe, expect, it } from "vitest";

import {
  validateCreateShipmentInput,
  validatePymeId,
} from "@/modules/shipments/shipments.validator";

describe("Shipment Create Payload Validator", () => {
  it("rechaza envío sin orderId", () => {
    expect(() =>
      validateCreateShipmentInput({
        orderId: "",
      })
    ).toThrow();
  });

  it("aprueba payload válido con campos mínimos requeridos", () => {
    expect(() =>
      validateCreateShipmentInput({
        orderId: "ORDER-001",
      })
    ).not.toThrow();
  });

  it("rechaza estimatedDelivery con formato inválido", () => {
    expect(() =>
      validateCreateShipmentInput({
        orderId: "ORDER-001",
        estimatedDelivery: "fecha-invalida",
      })
    ).toThrow();
  });

  it("rechaza pymeId vacío", () => {
    expect(() => validatePymeId("")).toThrow(/ID de la PYME es requerido/);
  });
});