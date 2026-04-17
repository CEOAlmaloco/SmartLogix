import { createServiceRoleClient } from "../supabase/supabaseService";

// Repositorio de inventario: encapsula las consultas e inserciones al esquema inventory_schema usando service role.

const SCHEMA = "inventory_schema";

export const InventoryRepository = {

    async findAllItems(pymeId: string){
        const db = createServiceRoleClient(SCHEMA);
        const {data, error} = await db
            .from('item')
            .select('*')
            .eq('pyme_id', pymeId);
        
        if (error) throw error;
        return data;
    },

    async createItem(pymeId: string, payload: {
        name: string, 
        sku: string, 
        quantity: number, 
        warehouse?: string
    }){
        const db = createServiceRoleClient(SCHEMA);
        const {data, error} = await db
            .from('item')
            .insert({...payload, pyme_id: pymeId})
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    
    async updateItem(id: string, pymeId: string, payload: {
        name?: string,
        quantity?: number, 
        warehouse?: string
    }){
        const db = createServiceRoleClient(SCHEMA);
        const {data, error} = await db
            .from('item')
            .update({payload})
            .eq('id', id)
            .eq('pyme_id', pymeId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};