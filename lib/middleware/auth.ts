import { cookies } from 'next/headers';
import { errorResponse } from "../shared";
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function getAuthenticatedUser() {
    const cookieStore = await cookies();

    // 1. BYPASS DE DESARROLLO
    // Usamos una variable de entorno adicional para mayor seguridad si fuera necesario
    if (process.env.NODE_ENV === 'development') {
        const DEBUG_PYME_ID = 'd5468f9d-eac7-4344-b568-619a0210ad45'; 

        return {
            user: { 
                id: '94985713-3a61-43b7-960c-6584682251f9',
                email: 'ga.aguila@duocuc.cl' 
            },
            pymeId: DEBUG_PYME_ID, 
            role: 'admin' as const, // Forzamos el tipo literal
            response: null
        };
    }

    // 2. Validación de Variables de Entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables missing");
    }

    // 3. Cliente Supabase SSR (Producción)
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
                    } catch (err) {
                        // El error aquí es normal si se llama desde un Server Component
                    }
                },
            },
        }
    );

    // 4. Verificación de Sesión Real
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            user: null,
            pymeId: null,
            role: null,
            response: errorResponse('UNAUTHORIZED', 'Usuario no autenticado', 401)
        }; 
    }

    // 5. Relación Pyme (Búsqueda en esquema public por defecto)
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