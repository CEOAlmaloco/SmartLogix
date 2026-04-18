import { HandlerError } from '@/lib/shared'
import { OrderRepository } from '../repositories/order.repository'

const VALID_TRANSITIONS: Record<string, string[]> = {
    pending: ['approved', 'cancelled'],
    approved: ['dispatched', 'cancelled'],
    dispatched: [],
    cancelled: []
}

export async function getOrdersHandler(pymeId: string) {
    if (!pymeId) {
        throw new HandlerError('VALIDATION_ERROR', 'pymeId requerido', 400)
    }

    return OrderRepository.findAllOrders(pymeId)
}

export async function createOrderHandler(
    pymeId: string,
    payload: {
        customerName: string
        customerEmail: string
        total: number
        notes?: string
    }
) {
    if (!pymeId) {
        throw new HandlerError('VALIDATION_ERROR', 'El ID de la PYME es requerido', 400)
    }

    if (!payload.customerName || !payload.customerEmail || payload.total === undefined) {
        throw new HandlerError('VALIDATION_ERROR', 'El nombre, email del cliente y total son requeridos', 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.customerEmail)) {
        throw new HandlerError('VALIDATION_ERROR', 'El email del cliente no es valido', 400)
    }

    if (typeof payload.total !== 'number' || payload.total <= 0) {
        throw new HandlerError('VALIDATION_ERROR', 'El total debe ser un numero mayor a 0', 400)
    }

    return OrderRepository.createOrder(pymeId, payload)
}

export async function updateOrderStatusHandler(
    pymeId: string,
    payload: {
        id: string
        status: string
    }
) {
    if (!pymeId) {
        throw new HandlerError('VALIDATION_ERROR', 'El ID de la PYME requerido', 400)
    }

    if (!payload.id || !payload.status) {
        throw new HandlerError('VALIDATION_ERROR', 'El ID y status son requeridos', 400)
    }

    const status = payload.status.toLowerCase()
    const currentRows = await OrderRepository.findAllOrders(pymeId)
    const currentOrder = currentRows.find((order: { id: string }) => order.id === payload.id)

    if (!currentOrder) {
        throw new HandlerError('NOT_FOUND', 'Pedido no encontrado', 404)
    }

    const currentStatus = String((currentOrder as { status?: string }).status ?? '').toLowerCase()
    if (!VALID_TRANSITIONS[currentStatus]?.includes(status)) {
        throw new HandlerError('VALIDATION_ERROR', `Transicion no permitida: ${currentStatus} -> ${status}`, 400)
    }

    return OrderRepository.updateOrderStatus(payload.id, pymeId, status)
}