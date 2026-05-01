import type { FormData } from "./hooks/useInventory";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import styles from "@/app/dashboard/dashboard.module.css";

type Props = {
  formData: FormData;
  editingId: string | null;
  submitting: boolean;
  onChange: (data: FormData) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
};

export function InventoryForm({
  formData,
  editingId,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <TextField
        label="Nombre"
        value={formData.name}
        onChange={(e) => onChange({ ...formData, name: e.target.value })}
        required
      />
      {!editingId ? (
        <TextField
          label="SKU"
          value={formData.sku}
          onChange={(e) => onChange({ ...formData, sku: e.target.value })}
          required
        />
      ) : null}
      <TextField
        label="Cantidad"
        type="number"
        min={0}
        value={formData.quantity.toString()}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (!Number.isNaN(parsed)) onChange({ ...formData, quantity: parsed });
        }}
        required
      />
      <TextField
        label="Almacén"
        value={formData.warehouse}
        onChange={(e) => onChange({ ...formData, warehouse: e.target.value })}
      />
      <div className={styles.formActions}>
        <Button type="submit" loading={submitting}>
          {editingId ? "Guardar cambios" : "Agregar item"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}