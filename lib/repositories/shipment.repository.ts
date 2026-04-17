import { createServiceRoleClient } from "../supabase/supabaseService";

// Repositorio de envio: encapsula las consultas e inserciones al esquema shipment_schema usando service role.

const SCHEMA = 'shipment_schema'

export const ShipmentRepository = {
  async findAll(pymeId: string) {
    const db = createServiceRoleClient(SCHEMA)
    const { data, error } = await db
      .from('shipment')
      .select('*')
      .eq('pyme_id', pymeId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(pymeId: string, payload: {
    order_id: string
    carrier?: string
    tracking_code?: string
    estimated_delivery?: string
  }) {
    const db = createServiceRoleClient(SCHEMA)
    const { data, error } = await db
      .from('shipment')
      .insert({ ...payload, pyme_id: pymeId, status: 'pending' })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateStatus(id: string, pymeId: string, payload: {
    status: string
    delivered_at?: string
  }) {
    const db = createServiceRoleClient(SCHEMA)
    const { data, error } = await db
      .from('shipment')
      .update(payload)
      .eq('id', id)
      .eq('pyme_id', pymeId)
      .select()
      .single()
    if (error) throw error
    return data
  }
}