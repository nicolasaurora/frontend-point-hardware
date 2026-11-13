const messagesByCode = {
  INVALID_CREDENTIALS: 'El email o la contraseña son incorrectos.',
  INVALID_TOKEN: 'Tu sesión venció o ya no es válida. Iniciá sesión nuevamente.',
  FORBIDDEN: 'No tenés permisos para realizar esta acción.',
  USER_NOT_FOUND: 'El usuario solicitado no existe.',
  PRODUCT_NOT_FOUND: 'El producto solicitado no existe o fue eliminado.',
  ORDER_NOT_FOUND: 'La orden solicitada no existe.',
  INVALID_USER_DATA: 'Revisá los datos del usuario.',
  INVALID_PRODUCT_DATA: 'Revisá los datos del producto.',
  INVALID_ORDER: 'La orden contiene datos inválidos.',
  INVALID_ROLE: 'El rol seleccionado no es válido.',
  EMAIL_ALREADY_EXISTS: 'Ya existe una cuenta registrada con ese email.',
  PRODUCT_NAME_ALREADY_EXISTS: 'Ya existe un producto con ese nombre.',
  INSUFFICIENT_STOCK: 'No hay stock suficiente para completar la compra.',
  INTERNAL_SERVER_ERROR: 'El servidor tuvo un problema. Intentá nuevamente más tarde.',
}

export const getApiError = async (response, fallbackMessage) => {
  let errorData = {}

  try {
    errorData = await response.json()
  } catch {
    // Algunas respuestas de error pueden no ser JSON, por ejemplo un 502 del hosting.
  }

  const error = new Error(
    errorData.message || messagesByCode[errorData.code] || fallbackMessage
  )

  error.code = errorData.code
  error.status = response.status

  return error
}

export const normalizeRequestError = (error) => {
  if (error?.code) return error

  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    const networkError = new Error(
      'No pudimos conectarnos al servidor. Verificá tu conexión e intentá nuevamente.'
    )
    networkError.code = 'NETWORK_ERROR'
    return networkError
  }

  if (error instanceof SyntaxError) {
    const responseError = new Error(
      'El servidor devolvió una respuesta inválida. Intentá nuevamente más tarde.'
    )
    responseError.code = 'INVALID_SERVER_RESPONSE'
    return responseError
  }

  return error
}
