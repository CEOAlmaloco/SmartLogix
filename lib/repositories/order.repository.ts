import { createServiceRoleClient } from "../supabase/supabaseService";

// Repositorio de pedidos: encapsula las consultas e inserciones al esquema order_schema usando service role.

const SCHEMA = "order_schema";

export const OrderRepository = {

    async findAllOrders(pymeId: string){
        const db = createServiceRoleClient(SCHEMA);
        const {data, error} = await db
            .from('purchase_order')
            .select('*')
            .eq('pyme_id', pymeId)
        if (error) throw error;
        return data;
    }, 

    async createOrder(pymeId: string, payload: {
        customerName: string,
        customerEmail: string,
        total: number,
        notes?: string
    }){
        const db = createServiceRoleClient(SCHEMA);
        const {data, error} = await db
            .from('purchase_order')
            .insert({...payload, pyme_id: pymeId, status: 'pending'})
            .select()
            .single()
        if (error) throw error;
        return data;
    }
}