import type { InventoryItem } from "./hooks/useInventory";
import styles from "@/app/dashboard/dashboard.module.css";

const LOW_STOCK_THRESHOLD = 5;

export function InventoryStats({ items }: { items: InventoryItem[] }) {
  const total = items.length;
  const outOfStock = items.filter((i) => i.quantity === 0).length;
  const lowStock = items.filter(
    (i) => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD
  ).length;

  return (
    <div className={styles.statsGrid}>
      <article>
        <strong>{total}</strong>
        <span>Total de productos</span>
      </article>
      <article>
        <strong>{outOfStock}</strong>
        <span>Sin stock</span>
      </article>
      <article>
        <strong>{lowStock}</strong>
        <span>Stock bajo (≤{LOW_STOCK_THRESHOLD})</span>
      </article>
    </div>
  );
}