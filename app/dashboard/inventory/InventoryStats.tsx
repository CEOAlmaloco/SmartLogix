import type { InventoryItem } from "@/app/dashboard/inventory/hooks/useInventory";
import styles from "../dashboard.module.css";

const LOW_STOCK_THRESHOLD = 5;

export function InventoryStats({ items }: { items: InventoryItem[] }) {
  const total = items.length;
  const outOfStock = items.filter((i) => i.quantity === 0).length;
  const lowStock = items.filter(
    (i) => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD
  ).length;

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Total de productos</span>
        <span className={styles.statValue}>{total}</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Sin stock</span>
        <span className={`${styles.statValue} ${styles.statDanger}`}>
          {outOfStock}
        </span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Stock bajo (≤{LOW_STOCK_THRESHOLD})</span>
        <span className={`${styles.statValue} ${styles.statWarn}`}>
          {lowStock}
        </span>
      </div>
    </div>
  );
}