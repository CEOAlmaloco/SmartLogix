import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const AuthRepository = {
  async signUp(email: string, password: string) {
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

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      const err = new Error(error.message) as Error & { code?: string; status?: number }
      err.code = 'AUTH_ERROR'
      err.status = 400
      throw err
    }
    return data.user
  }
}