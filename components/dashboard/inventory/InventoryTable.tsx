import type { InventoryItem } from "./hooks/useInventory";
import styles from "@/app/(views)/dashboard/dashboard.module.css";

function formatDate(value?: string) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

type Props = {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
};

export function InventoryTable({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return <p className={styles.empty}>No hay items registrados en inventario.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Precio unit.</th>
            <th>Cantidad</th>
            <th>Bodega</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(Number(item.unit_price ?? 0))}</td>
              <td>{item.quantity}</td>
              <td>{item.warehouse}</td>
              <td>{formatDate(item.created_at)}</td>
              <td>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={`${styles.tableActionBtn} ${styles.tableActionEdit}`}
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={`${styles.tableActionBtn} ${styles.tableActionDelete}`}
                    onClick={() => onDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}