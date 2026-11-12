import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { FaCartShopping } from 'react-icons/fa6';
import { AuthenticationContext } from './services/auth.context';
import { CartContext } from './services/cart.context.jsx';

const CustomNavbar = () => {
  const navigate = useNavigate()
  const { role } = useContext(AuthenticationContext)
  const { totalItems } = useContext(CartContext)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const updateNavbar = () => setIsCompact(window.scrollY > 40)

    updateNavbar()
    window.addEventListener('scroll', updateNavbar)

    return () => window.removeEventListener('scroll', updateNavbar)
  }, [])

  const handleNavHome = () => {
    navigate('home') // Tapa el tema del focus en los links
  }

  const handleNavProducts = () => {
    navigate('products') // Tapa el tema del focus en los links
  }

  const handleNavCart = () => {
    navigate('/cart')
  }

  const handleNavMyOrders = () => {
    navigate('/orders/my-orders')
  }

  const handleNavAdminOrders = () => {
    navigate('/admin/orders')
  }

  const handleNavAdminProducts = () => {
    navigate('admin/products')
  }

  const handleNavAboutUs = () => {
    navigate('/about-us') // Tapa el tema del focus en los links
  }

  const handleNavUsers = () => {
    navigate('superadmin/users') // Tapa el tema del focus en los links
  }

  const { handleUserLogout } = useContext(AuthenticationContext)

  const handleLogout = () => {
    handleUserLogout()
    navigate('/login')
  }

  return (
    <>
    <Navbar
      data-bs-theme="dark"
      fixed="top"
      className={`site-navbar ${isCompact ? 'site-navbar--compact' : ''}`}
    >
        <Container fluid className="site-navbar-container">
          <Nav className="site-nav-links gap-4">
            <Nav.Link onClick={handleNavHome}>Inicio</Nav.Link>
            {
              role === 'user' && <Nav.Link onClick={handleNavProducts}>Productos</Nav.Link>
            }
            {
              role === 'user' && <Nav.Link onClick={handleNavMyOrders}>Mis compras</Nav.Link>
            }
            {
              role !== 'user' && <Nav.Link onClick={handleNavAdminProducts}>Gestionar Productos</Nav.Link>
            }
            {
              role !== 'user' && <Nav.Link onClick={handleNavAdminOrders}>Gestionar Órdenes</Nav.Link>
            }
            {
              role === 'superadmin' && <Nav.Link onClick={handleNavUsers}>Gestionar Usuarios</Nav.Link>
            }
            <Nav.Link onClick={handleNavAboutUs}>Sobre nosotros</Nav.Link>
            <Nav.Link onClick={handleLogout}>Cerrar Sesion</Nav.Link>
          </Nav>
          {
            role === 'user' && (
              <Nav className="site-nav-cart">
                <Nav.Link
                  className="navbar-cart-link"
                  aria-label={`Carrito con ${totalItems} productos`}
                  onClick={handleNavCart}
                >
                  <FaCartShopping className="navbar-cart-icon" aria-hidden="true" />
                  ({totalItems})
                </Nav.Link>
              </Nav>
            )
          }
        </Container>
    </Navbar>
    <div className={`site-navbar-content ${isCompact ? 'site-navbar-content--compact' : ''}`}>
      <Outlet/>
    </div>
    </>
  )
}

export default CustomNavbar
