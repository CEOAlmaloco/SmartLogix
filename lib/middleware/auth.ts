import { cookies } from 'next/headers';
import { errorResponse } from "../shared";
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables missing");
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options as CookieOptions)
                        );
                    } catch {}
                },
            },
        }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            user: null,
            pymeId: null,
            role: null,
            response: errorResponse('UNAUTHORIZED', 'Usuario no autenticado', 401)
        };
    }

    const { data: pymeUser, error: pymeError } = await supabase
        .from('pyme_user')
        .select('pyme_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

    if (pymeError || !pymeUser) {
        return {
            user: null,
            pymeId: null,
            role: null,
            response: errorResponse('FORBIDDEN', 'Usuario no vinculado a una PYME', 403)
        };
    }

    return {
        user,
        pymeId: pymeUser.pyme_id,
        role: pymeUser.role,
        response: null
    };
}