"use client";

import { useInventory } from "@/app/dashboard/inventory/hooks/useInventory";
import { InventoryStats } from "./InventoryStats";
import { InventoryTable } from "./InventoryTable";
import { InventoryForm } from "./InventoryForm";
import { StatusMessage } from "@/components/ui/StatusMessage";
import styles from "../dashboard.module.css";

export default function InventoryDashboardPage() {
  const {
    items, loading, error, success,
    showForm, setShowForm,
    editingItem, formData, setFormData,
    handleSubmit, handleEdit, handleDelete, startCreate,
  } = useInventory();

  if (loading) {
    return <section className={styles.panel}><p>Cargando inventario...</p></section>;
  }

  return (
    <section className={styles.panel}>

      <div className={styles.header}>
        <h2>Inventario</h2>
        <button className={styles.btnAdd} onClick={startCreate}>
          <span>+</span> Agregar item
        </button>
      </div>

      {error && <StatusMessage variant="error" message={error} />}
      {success && <StatusMessage variant="success" message={success} />}

      <InventoryStats items={items} />

      {showForm && (
        <InventoryForm
          formData={formData}
          editingId={editingItem?.id ?? null}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <InventoryTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </section>
  );
}