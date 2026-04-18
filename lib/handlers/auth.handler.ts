import { AuthRepository } from '@/lib/repositories/auth.repository'
import { PymeRepository } from '@/lib/repositories/pyme.repository'
import { HandlerError } from '../shared'

export type RegisterResult = {
  userId: string
  pymeId: string
}

export async function registerHandler(email: string, password: string, pymeName: string): Promise<RegisterResult> {
    if (!email || !password || !pymeName) {
        throw new HandlerError('VALIDATION_ERROR', 'email, password y pymeName son requeridos', 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new HandlerError('VALIDATION_ERROR', 'email no es valido', 400)
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)){
        throw new HandlerError('VALIDATION_ERROR', 'La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 numero', 400)
    }

    if (password.length < 8) {
        throw new HandlerError('VALIDATION_ERROR', 'La contraseña debe tener al menos 8 caracteres', 400)
    }

    if (pymeName.length < 3 || pymeName.length > 80) {
        throw new HandlerError('VALIDATION_ERROR', 'El nombre de la PYME debe tener entre 3 y 80 caracteres', 400)
    }

    try {
        const user = await AuthRepository.signUp(email, password)
        if (!user) throw new HandlerError('AUTH_ERROR', 'Error al registrar', 400)

        const pyme = await PymeRepository.create(pymeName, user.id)
        await PymeRepository.createMember(pyme.id, user.id, 'owner')

        return { userId: user.id, pymeId: pyme.id }
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string; status?: number }
        if (err.code === '23505') {
        throw new HandlerError('DB_ERROR', 'El nombre de la PYME ya esta en uso', 400)
        }
        if (error instanceof HandlerError) throw error
        throw new HandlerError(err.code ?? 'DB_ERROR', err.message ?? 'Error al registrar', err.status ?? 500)
    }
}