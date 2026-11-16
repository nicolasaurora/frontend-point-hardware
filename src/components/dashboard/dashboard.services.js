import { BASE_URL } from '../services/config'
import { getApiError, normalizeRequestError } from '../services/apiError'

const dashboardRequest = async (path, token, fallbackMessage) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw await getApiError(response, fallbackMessage)
    }

    return response.json()
  } catch (error) {
    throw normalizeRequestError(error)
  }
}

export const getDashboardSummary = (token) =>
  dashboardRequest('/dashboard/summary', token, 'No se pudo cargar el resumen del dashboard.')

export const getTopProducts = (token) =>
  dashboardRequest('/dashboard/top-products', token, 'No se pudieron cargar los productos más vendidos.')

export const getLowStockProducts = (token) =>
  dashboardRequest('/dashboard/low-stock', token, 'No se pudo cargar el estado de stock.')

export const getDashboardInsights = (token) =>
  dashboardRequest('/dashboard/insights', token, 'No se pudieron cargar los insights del negocio.')

export const getSalesOverTime = (token, from, to) => {
  const params = new URLSearchParams()

  if (from && to) {
    params.set('from', from)
    params.set('to', to)
  }

  const query = params.toString()
  const path = `/dashboard/sales-over-time${query ? `?${query}` : ''}`

  return dashboardRequest(path, token, 'No se pudo cargar la evolución de ventas.')
}
