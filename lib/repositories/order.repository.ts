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
            .insert({
                pyme_id: pymeId,
                customer_name: payload.customerName,
                customer_email: payload.customerEmail,
                total: payload.total,
                notes: payload.notes,
                status: 'pending'
            })
            .select()
            .single()
        if (error) throw error;
        return data;
    },
    
    async updateOrderStatus(id: string, pymeId: string, status:string){
        const db = createServiceRoleClient(SCHEMA);
        const {data, error} = await db
            .from('purchase_order')
            .update({status})
            .eq('id', id)
            .eq('pyme_id', pymeId)
            .select()
            .single()
        if (error) throw error;
        return data;
    }
}