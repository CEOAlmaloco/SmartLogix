import type { FormData } from "@/app/dashboard/inventory/hooks/useInventory";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import styles from "../dashboard.module.css";

type Props = {
  formData: FormData;
  editingId: string | null;
  onChange: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function InventoryForm({
  formData, editingId, onChange, onSubmit, onCancel,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <TextField
        label="Nombre"
        value={formData.name}
        onChange={(e) => onChange({ ...formData, name: e.target.value })}
        required
      />
      <TextField
        label="SKU"
        value={formData.sku}
        onChange={(e) => onChange({ ...formData, sku: e.target.value })}
        required
      />
      <TextField
        label="Cantidad"
        type="number"
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
        <Button type="submit">
          {editingId ? "Actualizar" : "Crear"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}