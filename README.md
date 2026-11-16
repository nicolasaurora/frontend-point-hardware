# Point Hardware

Aplicación web de e-commerce para la gestión y compra de componentes de hardware. Permite registrarse, iniciar sesión, explorar productos, usar un carrito de compras y administrar recursos según el rol del usuario.

## Funcionalidades

- Registro e inicio de sesión con JWT.
- Rutas protegidas según rol: user, admin y superadmin.
- Catálogo de productos y carrito persistente con `localStorage`.
- Creación de órdenes, historial de compras y ticket de compra.
- ABM de productos para admin.
- Gestión de órdenes para admin.
- Gestión de user y roles para superadmin.

## Dashboard administrativo

Los usuarios con rol `admin` o `superadmin` pueden acceder a `/admin/dashboard`.

El dashboard consume endpoints protegidos mediante JWT y muestra:

- Facturación total, cantidad de órdenes, ticket promedio y unidades vendidas.
- Productos más vendidos mediante un gráfico de barras.
- Evolución de ventas con filtro de rango de fechas.
- Productos con bajo stock.
- Insights automáticos generados a partir de métricas reales del negocio.

## Tecnologías

- React + Vite
- React Router
- React Bootstrap y Bootstrap
- Context API
- React Toastify
- JWT Decode

