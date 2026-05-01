"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { InventoryForm } from "@/components/dashboard/inventory/InventoryForm";
import { InventoryStats } from "@/components/dashboard/inventory/InventoryStats";
import { InventoryTable } from "@/components/dashboard/inventory/InventoryTable";
import { useInventory } from "@/components/dashboard/inventory/hooks/useInventory";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import styles from "../dashboard.module.css";

export default function InventoryDashboardPage() {
	const {
		items,
		loading,
		submitting,
		error,
		success,
		showForm,
		setShowForm,
		deleteTarget,
		editingItem,
		formData,
		setFormData,
		handleSubmit,
		handleEdit,
		requestDelete,
		confirmDelete,
		cancelDelete,
		startCreate,
	} = useInventory();

	return (
		<DashboardPanel
		  title="Inventario"
		  subtitle="Stock por bodega con acciones rápidas de creación, edición y eliminación."
		  actions={<Button type="button" onClick={startCreate}>Agregar item</Button>}
		>

			{error ? <StatusMessage variant="error" message={error} /> : null}
			{success ? <StatusMessage variant="success" message={success} /> : null}

			<InventoryStats items={items} />

			{loading ? <p className={styles.loadingText}>Cargando inventario...</p> : null}
			{!loading ? (
				<InventoryTable items={items} onEdit={handleEdit} onDelete={requestDelete} />
			) : null}

			<Modal
				open={showForm}
				onClose={() => setShowForm(false)}
				title={editingItem ? "Editar item" : "Agregar item"}
			>
				<InventoryForm
					formData={formData}
					editingId={editingItem?.id ?? null}
					submitting={submitting}
					onChange={setFormData}
					onSubmit={handleSubmit}
					onCancel={() => setShowForm(false)}
				/>
			</Modal>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={cancelDelete}
				title="Eliminar item"
			>
				<p className={styles.confirmText}>
					¿Eliminar este item? Esta acción no se puede deshacer.
				</p>
				<div className={styles.formActions}>
					<Button type="button" variant="soft" onClick={confirmDelete} loading={submitting}>
						Confirmar eliminación
					</Button>
					<Button type="button" variant="ghost" onClick={cancelDelete} disabled={submitting}>
						Cancelar
					</Button>
				</div>
			</Modal>
		</DashboardPanel>
	);
}