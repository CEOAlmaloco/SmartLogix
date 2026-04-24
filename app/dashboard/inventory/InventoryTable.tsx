import type { InventoryItem } from "@/app/dashboard/inventory/hooks/useInventory";
import styles from "../dashboard.module.css";

const LOW_STOCK = 5;

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0)
    return <span className={`${styles.badge} ${styles.badgeOut}`}>{qty}</span>;
  if (qty <= LOW_STOCK)
    return <span className={`${styles.badge} ${styles.badgeLow}`}>{qty}</span>;
  return <span className={`${styles.badge} ${styles.badgeOk}`}>{qty}</span>;
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2l3 3-9 9H2v-3L11 2z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,5 13,5" />
      <path d="M6 5V3h4v2" />
      <path d="M5 5l1 9h4l1-9" />
    </svg>
  );
}

type Props = {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
};

export function InventoryTable({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return <p className={styles.empty}>No hay items en el inventario.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>SKU</th>
            <th className={styles.numCol}>Cantidad</th>
            <th>Almacén</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={styles.tableRow}>
              <td>{item.name}</td>
              <td className={styles.skuCell}>{item.sku}</td>
              <td className={styles.numCol}>
                <StockBadge qty={item.quantity} />
              </td>
              <td className={styles.mutedCell}>{item.warehouse}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                    onClick={() => onEdit(item)}
                    title="Editar"
                  >
                    <IconEdit />
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnDel}`}
                    onClick={() => onDelete(item.id)}
                    title="Eliminar"
                  >
                    <IconTrash />
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