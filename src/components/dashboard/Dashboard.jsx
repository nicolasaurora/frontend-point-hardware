import { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Badge, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { errorToast } from '../notifications/Notifications'
import { AuthenticationContext } from '../services/auth.context'
import {
  getDashboardSummary,
  getLowStockProducts,
  getSalesOverTime,
  getTopProducts,
} from './dashboard.services'

const formatPrice = (value) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
}).format(Number(value) || 0)

const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('es-AR', {
  day: '2-digit',
  month: 'short',
})

const SummaryCard = ({ label, value, isCurrency = false }) => (
  <Card className="dashboard-summary-card h-100 border-0 shadow-sm">
    <Card.Body>
      <p className="dashboard-summary-label">{label}</p>
      <p className="dashboard-summary-value mb-0">
        {isCurrency ? formatPrice(value) : new Intl.NumberFormat('es-AR').format(Number(value) || 0)}
      </p>
    </Card.Body>
  </Card>
)

const EmptyChart = ({ children }) => (
  <div className="dashboard-empty-state">{children}</div>
)

const TopProductsChart = ({ products }) => {
  if (!products.length) {
    return <EmptyChart>No hay ventas registradas para mostrar productos destacados.</EmptyChart>
  }

  const maxUnits = Math.max(...products.map(product => Number(product.unitsSold) || 0), 1)

  return (
    <div className="dashboard-bars" aria-label="Gráfico de productos más vendidos">
      {products.map(product => {
        const unitsSold = Number(product.unitsSold) || 0
        const width = `${(unitsSold / maxUnits) * 100}%`

        return (
          <div className="dashboard-bar-row" key={product.productId}>
            <div className="dashboard-bar-heading">
              <span className="dashboard-product-name">{product.name}</span>
              <strong>{unitsSold} unidades</strong>
            </div>
            <div className="dashboard-bar-track">
              <div className="dashboard-bar-fill" style={{ width }}>
                <span className="visually-hidden">{unitsSold} unidades vendidas</span>
              </div>
            </div>
            <small>Facturación: {formatPrice(product.revenue)}</small>
          </div>
        )
      })}
    </div>
  )
}

const SalesLineChart = ({ sales }) => {
  if (!sales.length) {
    return <EmptyChart>No hay ventas registradas en el período seleccionado.</EmptyChart>
  }

  const chartWidth = 700
  const chartHeight = 240
  const padding = { top: 20, right: 24, bottom: 42, left: 58 }
  const maxRevenue = Math.max(...sales.map(item => Number(item.revenue) || 0), 1)
  const usableWidth = chartWidth - padding.left - padding.right
  const usableHeight = chartHeight - padding.top - padding.bottom
  const getX = (index) => {
    if (sales.length === 1) return padding.left + usableWidth / 2
    return padding.left + (index / (sales.length - 1)) * usableWidth
  }
  const getY = (revenue) => padding.top + usableHeight - ((Number(revenue) || 0) / maxRevenue) * usableHeight
  const points = sales.map((item, index) => `${getX(index)},${getY(item.revenue)}`).join(' ')
  const firstSale = sales[0]
  const lastSale = sales[sales.length - 1]

  return (
    <div className="dashboard-line-chart" aria-label="Gráfico de evolución de ventas">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Facturación por fecha">
        <line
          className="dashboard-chart-axis"
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={padding.top + usableHeight}
        />
        <line
          className="dashboard-chart-axis"
          x1={padding.left}
          x2={chartWidth - padding.right}
          y1={padding.top + usableHeight}
          y2={padding.top + usableHeight}
        />
        <text className="dashboard-chart-label" x="4" y={padding.top + 6}>{formatPrice(maxRevenue)}</text>
        <text className="dashboard-chart-label" x={padding.left} y={chartHeight - 12}>{formatDate(firstSale.date)}</text>
        <text className="dashboard-chart-label" textAnchor="end" x={chartWidth - padding.right} y={chartHeight - 12}>
          {formatDate(lastSale.date)}
        </text>
        <polyline className="dashboard-chart-line" points={points} />
        {sales.map((item, index) => (
          <circle
            className="dashboard-chart-point"
            cx={getX(index)}
            cy={getY(item.revenue)}
            key={`${item.date}-${index}`}
            r="4"
          >
            <title>{`${formatDate(item.date)}: ${formatPrice(item.revenue)} · ${item.orders} órdenes`}</title>
          </circle>
        ))}
      </svg>
      <p className="dashboard-chart-caption mb-0">Pasá el cursor sobre un punto para ver facturación y órdenes.</p>
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { token, handleUserLogout } = useContext(AuthenticationContext)
  const [summary, setSummary] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [lowStock, setLowStock] = useState({ threshold: 0, products: [] })
  const [sales, setSales] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [isLoadingOverview, setIsLoadingOverview] = useState(true)
  const [isLoadingSales, setIsLoadingSales] = useState(true)
  const [overviewError, setOverviewError] = useState('')
  const [salesError, setSalesError] = useState('')
  const hasInvalidDateRange = Boolean(from && to && from > to)

  const handleAccessError = useCallback((requestError) => {
    if (requestError.code === 'INVALID_TOKEN') {
      handleUserLogout()
      errorToast(requestError.message)
      navigate('/login', { replace: true })
      return true
    }

    if (requestError.code === 'FORBIDDEN') {
      errorToast(requestError.message)
      navigate('/home', { replace: true })
      return true
    }

    return false
  }, [handleUserLogout, navigate])

  useEffect(() => {
    let isMounted = true

    const loadOverview = async () => {
      setIsLoadingOverview(true)
      setOverviewError('')

      try {
        const [summaryData, topProductsData, lowStockData] = await Promise.all([
          getDashboardSummary(token),
          getTopProducts(token),
          getLowStockProducts(token),
        ])

        if (!isMounted) return
        setSummary(summaryData)
        setTopProducts(Array.isArray(topProductsData) ? topProductsData : [])
        setLowStock(lowStockData || { threshold: 0, products: [] })
      } catch (requestError) {
        if (!isMounted || handleAccessError(requestError)) return
        setOverviewError(requestError.message)
        errorToast(requestError.message)
      } finally {
        if (isMounted) setIsLoadingOverview(false)
      }
    }

    loadOverview()

    return () => {
      isMounted = false
    }
  }, [handleAccessError, token])

  useEffect(() => {
    if ((from && !to) || (!from && to)) return

    if (hasInvalidDateRange) return

    let isMounted = true

    const loadSales = async () => {
      setIsLoadingSales(true)
      setSalesError('')

      try {
        const salesData = await getSalesOverTime(token, from, to)
        if (isMounted) setSales(Array.isArray(salesData) ? salesData : [])
      } catch (requestError) {
        if (!isMounted || handleAccessError(requestError)) return
        setSalesError(requestError.message)
        errorToast(requestError.message)
      } finally {
        if (isMounted) setIsLoadingSales(false)
      }
    }

    loadSales()

    return () => {
      isMounted = false
    }
  }, [from, handleAccessError, hasInvalidDateRange, to, token])

  return (
    <Container className="dashboard-container my-4">
      <header className="dashboard-header">
        <p className="dashboard-eyebrow">Administración</p>
        <h1>Dashboard</h1>
        <p className="mb-0">Seguimiento de ventas, órdenes y stock de Point Hardware.</p>
      </header>

      {overviewError && <Alert variant="danger">{overviewError}</Alert>}

      <section aria-labelledby="dashboard-summary-title">
        <h2 className="dashboard-section-title" id="dashboard-summary-title">Resumen general</h2>
        {isLoadingOverview ? (
          <div className="dashboard-loader"><Spinner animation="border" role="status" /> <span>Cargando indicadores...</span></div>
        ) : summary && (
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}><SummaryCard label="Facturación total" value={summary.totalRevenue} isCurrency /></Col>
            <Col xs={12} sm={6} xl={3}><SummaryCard label="Órdenes realizadas" value={summary.totalOrders} /></Col>
            <Col xs={12} sm={6} xl={3}><SummaryCard label="Ticket promedio" value={summary.averageTicket} isCurrency /></Col>
            <Col xs={12} sm={6} xl={3}><SummaryCard label="Unidades vendidas" value={summary.unitsSold} /></Col>
          </Row>
        )}
      </section>

      <Row className="g-4 dashboard-content-row">
        <Col lg={6}>
          <Card className="dashboard-panel h-100 border-0 shadow-sm">
            <Card.Body>
              <h2 className="dashboard-panel-title">Productos más vendidos</h2>
              {isLoadingOverview ? <div className="dashboard-loader"><Spinner animation="border" size="sm" /> Cargando productos...</div> : <TopProductsChart products={topProducts} />}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="dashboard-panel h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="dashboard-panel-heading">
                <h2 className="dashboard-panel-title">Productos con bajo stock</h2>
                {lowStock.threshold > 0 && <Badge bg="warning" text="dark">Umbral: {lowStock.threshold}</Badge>}
              </div>
              {isLoadingOverview ? <div className="dashboard-loader"><Spinner animation="border" size="sm" /> Cargando stock...</div> : lowStock.products?.length ? (
                <Table responsive hover className="dashboard-stock-table mb-0">
                  <thead>
                    <tr><th>Producto</th><th>Categoría</th><th className="text-end">Stock</th></tr>
                  </thead>
                  <tbody>
                    {lowStock.products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img className="dashboard-stock-image" src={product.image} alt="" />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td className="text-end"><Badge bg="danger">{product.stock}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : <EmptyChart>No hay productos con bajo stock.</EmptyChart>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <section className="dashboard-sales-section" aria-labelledby="dashboard-sales-title">
        <Card className="dashboard-panel border-0 shadow-sm">
          <Card.Body>
            <div className="dashboard-sales-heading">
              <div>
                <h2 className="dashboard-panel-title mb-1" id="dashboard-sales-title">Evolución de ventas</h2>
                <p className="text-muted mb-0">Por defecto se muestran los últimos 30 días.</p>
              </div>
              <div className="dashboard-date-filters">
                <Form.Group controlId="dashboard-date-from">
                  <Form.Label>Desde</Form.Label>
                  <Form.Control type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} />
                </Form.Group>
                <Form.Group controlId="dashboard-date-to">
                  <Form.Label>Hasta</Form.Label>
                  <Form.Control type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} />
                </Form.Group>
              </div>
            </div>

            {hasInvalidDateRange ? <Alert variant="danger" className="mt-4 mb-0">La fecha desde no puede ser posterior a la fecha hasta.</Alert> : salesError ? <Alert variant="danger" className="mt-4 mb-0">{salesError}</Alert> : isLoadingSales ? (
              <div className="dashboard-loader"><Spinner animation="border" role="status" /> <span>Cargando evolución de ventas...</span></div>
            ) : <SalesLineChart sales={sales} />}
          </Card.Body>
        </Card>
      </section>
    </Container>
  )
}

export default Dashboard
