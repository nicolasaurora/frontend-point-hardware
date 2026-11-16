import { useEffect, useState } from 'react'
import { Button, Container, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { getMyOrders } from './order.services'

const formatPrice = (value) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
}).format(value)

const OrderHistory = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getMyOrders(
      data => {
        setOrders(data)
      },
      Error => {
        setError(Error.message)
      }
    )
  }, [])

  if (error) {
    return (
      <Container className="my-5 text-center">
        <h2>No pudimos cargar tus compras</h2>
        <p className="text-muted">{error}</p>
        <Button onClick={() => navigate('/products')}>Ver productos</Button>
      </Container>
    )
  }

  if (orders.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Todavía no realizaste compras</h2>
        <p className="text-muted">Cuando confirmes una orden, aparecerá en este historial.</p>
        <Button onClick={() => navigate('/products')}>Ver productos</Button>
      </Container>
    )
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Mis compras</h2>

      <Table responsive hover className="align-middle">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Fecha</th>
            <th className="text-end">Total</th>
            <th className="text-end">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{new Date(order.createdAt || order.date).toLocaleString('es-AR')}</td>
              <td className="text-end">{formatPrice(order.total)}</td>
              <td className="text-end">
                <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                  Ver ticket
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default OrderHistory
