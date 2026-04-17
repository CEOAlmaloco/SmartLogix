
import { cookies } from 'next/headers';
import { errorResponse } from "../shared";
import { createServerClient } from '@supabase/ssr';

export async function getAuthenticatedUser(){
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll()},
                setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set({ name, value, ...options })
                        )
                    } catch {}
                }
            }
        }
    )

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user){
        return {user: null, pymeId: null, response: errorResponse('UNAUTHORIZED', 'Usuario no autenticado', error, 401)}
    }

    const { data: pymeUser, error: pymeError } = await supabase
        .from('pyme_user')
        .select('pyme_id, role')
        .eq('user_id', user.id)
        .single();

    if (pymeError || !pymeUser){
        return {user: null, pymeId: null, response: errorResponse('UNAUTHORIZED', 'Usuario no autorizado', pymeError, 403)}
    }
    
    return {user, pymeId: pymeUser.pyme_id, role: pymeUser.role, response: null}
}