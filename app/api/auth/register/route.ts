import { errorResponse, successResponse } from '@/lib/shared'
import { createServiceRoleClient } from '@/lib/supabase/supabaseService'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


export async function POST(request: Request) {
  const { email, password, pymeName } = await request.json()

  if (!email || !password || !pymeName) {
    return errorResponse('VALIDATION_ERROR', 'email, password y pymeName son requeridos', 400)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        }
      }
    }
  )

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })

  if (authError || !authData.user) {
    return errorResponse('AUTH_ERROR', authError?.message ?? 'Error al registrar', 400)
  }

  // 2. Crear PYME y membresía con service role (bypasea RLS)
  const adminDb = createServiceRoleClient('public')

  const { data: pyme, error: pymeError } = await adminDb
    .from('pyme')
    .insert({ name: pymeName, owner_id: authData.user.id })
    .select()
    .single()

  if (pymeError) {
    return errorResponse('DB_ERROR', 'Error al crear PYME', pymeError, 500)
  }

  const { error: memberError } = await adminDb
    .from('pyme_user')
    .insert({ pyme_id: pyme.id, user_id: authData.user.id, role: 'owner' })

  if (memberError) {
    return errorResponse('DB_ERROR', 'Error al crear membresía', memberError, 500)
  }

  return successResponse({ userId: authData.user.id, pymeId: pyme.id }, 'Registro exitoso', 201)
}