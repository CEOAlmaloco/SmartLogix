import { FormEvent, useState, useEffect, useCallback } from "react";

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  warehouse: string;
  created_at: string;
  updated_at: string;
};

export type FormData = {
  name: string;
  sku: string;
  quantity: number;
  warehouse: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  sku: "",
  quantity: 0,
  warehouse: "principal",
};

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/inventory", {
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Error al obtener inventario");
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) return setError("El nombre es obligatorio");
    if (!formData.sku.trim()) return setError("El SKU es obligatorio");
    if (!Number.isInteger(formData.quantity) || formData.quantity < 0)
      return setError("La cantidad debe ser un entero mayor o igual a 0");

    try {
      setSubmitting(true);
      const url = editingItem ? `/api/inventory/${editingItem.id}` : "/api/inventory";
      const method = editingItem ? "PATCH" : "POST";
      const payload = editingItem
        ? {
            name: formData.name,
            quantity: formData.quantity,
            warehouse: formData.warehouse,
          }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Error al guardar item");
      setSuccess(editingItem ? "Item actualizado correctamente" : "Item creado correctamente");
      setShowForm(false);
      setEditingItem(null);
      setFormData(EMPTY_FORM);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setError(null);
    setSuccess(null);
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      warehouse: item.warehouse,
    });
    setShowForm(true);
  };

  const requestDelete = (id: string) => {
    const target = items.find((item) => item.id === id) ?? null;
    setDeleteTarget(target);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setError(null);
    setSuccess(null);

    try {
      setSubmitting(true);
      const res = await fetch(`/api/inventory/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Error al eliminar item");
      setSuccess("Item eliminado correctamente");
      setDeleteTarget(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  const startCreate = () => {
    setError(null);
    setSuccess(null);
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  return {
    items,
    loading,
    submitting,
    error,
    success,
    showForm, setShowForm,
    deleteTarget,
    editingItem, formData, setFormData,
    handleSubmit,
    handleEdit,
    requestDelete,
    confirmDelete,
    cancelDelete,
    startCreate,
  };
}