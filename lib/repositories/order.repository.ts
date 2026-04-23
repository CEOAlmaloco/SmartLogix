import { createServiceRoleClient } from "../supabase/supabaseService";

// Asegúrate de que 'order_schema' esté en Settings > API > Exposed Schemas en Supabase
const SCHEMA = "order_schema";

export const OrderRepository = {

    async findAllOrders(pymeId: string) {
        const db = createServiceRoleClient(SCHEMA);
        const { data, error } = await db
            .from('purchase_order')
            .select('*')
            .eq('pyme_id', pymeId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("❌ Error en OrderRepository (findAll):", error.message);
            throw error;
        }
        return data || [];
    },

    async createOrder(pymeId: string, payload: {
        customerName: string,
        customerEmail: string,
        total: number,
        notes?: string
    }) {
        const db = createServiceRoleClient(SCHEMA);
        const { data, error } = await db
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
            .maybeSingle(); // Cambiado de .single() para mayor seguridad

        if (error) {
            console.error("❌ Error en OrderRepository (create):", error.message);
            throw error;
        }
        return data;
    },

    async updateOrderStatus(id: string, pymeId: string, status: string) {
        const db = createServiceRoleClient(SCHEMA);
        const { data, error } = await db
            .from('purchase_order')
            .update({ status })
            .eq('id', id)
            .eq('pyme_id', pymeId)
            .select()
            .maybeSingle(); // Si el ID no existe, devuelve null en lugar de Error 500

        if (error) {
            console.error("❌ Error en OrderRepository (updateStatus):", error.message);
            throw error;
        }
        return data;
    }
}