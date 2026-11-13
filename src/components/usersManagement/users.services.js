import { TOKEN_KEY, BASE_URL } from '../services/config'
import { getApiError, normalizeRequestError } from '../services/apiError'

export const getUsers = (onSuccess, onError) => {
    fetch(`${BASE_URL}/users` , {
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
    })
    .then(async res => {
        if (!res.ok) {
            throw await getApiError(res, 'No se pudieron cargar los usuarios.')
        }
        return res.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}

export const updateUser = (changedUser, onSuccess, onError) => {
    fetch(`${BASE_URL}/users/${changedUser.id}`, {
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            'Content-type' : 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(changedUser)
    })
    .then(async res => {
        if(!res.ok) {
            throw await getApiError(res, 'No se pudo editar el usuario.')
        }
        return res.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}

export const deleteUser = (userId, onSuccess, onError) => {
    fetch(`${BASE_URL}/users/${userId}`, {
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        method: 'DELETE',
    })
    .then(async res => {
        if (!res.ok) {
            throw await getApiError(res, 'No se pudo eliminar el usuario.')
        }
        return res.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}

export const updateUserRole = (changedUser, onSuccess, onError) => {
    fetch(`${BASE_URL}/users/${changedUser.id}/role`, {
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            'Content-type' : 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify(changedUser)
    })
    .then(async res => {
        if(!res.ok) {
            throw await getApiError(res, 'No se pudo actualizar el rol del usuario.')
        }
        
        return res.json()
    })
    .then(onSuccess)
    .catch(error => onError(normalizeRequestError(error)))
}
