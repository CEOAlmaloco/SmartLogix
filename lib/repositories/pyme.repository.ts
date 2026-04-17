import { createServiceRoleClient } from "../supabase/supabaseService";

const SCHEMA = 'public'

export const PymeRepository = {
  async create(name: string, ownerId: string) {
    const db = createServiceRoleClient(SCHEMA)
    const { data, error } = await db
      .from('pyme')
      .insert({ name, owner_id: ownerId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async createMember(pymeId: string, userId: string, role: 'owner' | 'admin') {
    const db = createServiceRoleClient(SCHEMA)
    const { error } = await db
      .from('pyme_user')
      .insert({ pyme_id: pymeId, user_id: userId, role })
    if (error) throw error
  }
}