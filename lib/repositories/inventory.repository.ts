import { createServiceRoleClient } from "../supabase/supabaseService";

const SCHEMA = "inventory_schema"; 

export const InventoryRepository = {

    async findAllItems(pymeId: string) {
        const db = createServiceRoleClient(SCHEMA);

        const { data, error } = await db
            .from('item')
            .select('*')
            .eq('pyme_id', pymeId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("❌ Error en findAllItems:", error.message);
            throw error;
        }

        return data || [];
    },

    async findItemById(id: string, pymeId: string) {
        const db = createServiceRoleClient(SCHEMA);

        const { data, error } = await db
            .from('item')
            .select('*')
            .eq('id', id)
            .eq('pyme_id', pymeId)
            .eq('is_active', true)
            .maybeSingle();

        if (error) {
            console.error("❌ Error en findItemById:", error.message);
            throw error;
        }

        return data;
    },

    async createItem(
        pymeId: string,
        payload: {
            name: string,
            sku: string,
            quantity: number,
            warehouse?: string
        }
    ) {
        const db = createServiceRoleClient(SCHEMA);

        // 1. ¿Existe ya un item con ese SKU (activo o inactivo)?
  const { data: existing } = await db
    .from('item')
    .select('id, is_active')
    .eq('pyme_id', pymeId)
    .eq('sku', payload.sku)
    .maybeSingle();

  // 2. Si existe y está activo → conflicto real
  if (existing?.is_active) {
    const err = new Error('SKU already exists') as any;
    err.code = 'CONFLICT';
    err.status = 409;
    throw err;
  }

  // 3. Si existe pero está inactivo → reactivar con los nuevos datos
  if (existing && !existing.is_active) {
    const { data, error } = await db
      .from('item')
      .update({
        ...payload,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 4. No existe → insertar normalmente
  const { data, error } = await db
    .from('item')
    .insert({ ...payload, pyme_id: pymeId, is_active: true })
    .select()
    .single();

  if (error) throw error;
  return data;
},
    async updateItem(
        id: string,
        pymeId: string,
        payload: {
            name?: string,
            sku?: string,
            quantity?: number,
            warehouse?: string
        }
    ) {
        // 1. Limpieza de campos undefined para evitar errores de actualización
        const cleanUpdate = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(cleanUpdate).length === 0) {
            throw new Error("No fields provided for update");
        }

        const db = createServiceRoleClient(SCHEMA);

        const { data, error } = await db
            .from('item')
            .update({
                ...cleanUpdate,
                updated_at: new Date().toISOString() // Asegura que se refresque la fecha
            })
            .eq('id', id)
            .eq('pyme_id', pymeId)
            .eq('is_active', true)
            .select()
            .maybeSingle();

        if (error) {
            console.error("❌ Error en updateItem:", error.message);
            throw error;
        }

        return data;
    },

    async deleteItem(id: string, pymeId: string) {
        const db = createServiceRoleClient(SCHEMA);

        // Soft delete: cambiamos is_active a false
        const { data, error } = await db
            .from('item')
            .update({ 
                is_active: false,
                updated_at: new Date().toISOString() 
            })
            .eq('id', id)
            .eq('pyme_id', pymeId)
            .eq('is_active', true)
            .select()
            .maybeSingle();

        if (error) {
            console.error("❌ Error en deleteItem:", error.message);
            throw error;
        }

        return data;
    }
};