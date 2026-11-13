import { BASE_URL, TOKEN_KEY } from '../services/config'
import { getApiError, normalizeRequestError } from '../services/apiError'

export const createOrder = (cartItems, onSuccess, onError) => {
  const items = cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity,
  }))

  fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  })
    .then(async response => {
      if (!response.ok) {
        throw await getApiError(response, 'No se pudo confirmar la compra.')
      }

      return response.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}

export const getOrder = (orderId, onSuccess, onError) => {
  fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
  })
    .then(async response => {
      if (!response.ok) {
        throw await getApiError(response, 'No se pudo cargar la orden.')
      }

      return response.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}

export const getMyOrders = (onSuccess, onError) => {
  fetch(`${BASE_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
  })
    .then(async response => {
      if (!response.ok) {
        throw await getApiError(response, 'No se pudo cargar el historial de compras.')
      }

      return response.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}

export const getAllOrders = (onSuccess, onError) => {
  fetch(`${BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
  })
    .then(async response => {
      if (!response.ok) {
        throw await getApiError(response, 'No se pudieron cargar las órdenes.')
      }

      return response.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}
