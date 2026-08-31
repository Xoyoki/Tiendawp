import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Shop from '../views/Shop.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Proyectos from '../views/Proyectos.vue';
import Favoritos from '../views/Favoritos.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import AddProduct from '../views/AddProduct.vue';
import AdminProducts from '../views/AdminProducts.vue';
import AdminOrders from '../views/AdminOrders.vue';
import AdminCustomers from '../views/AdminCustomers.vue';
import Banners from '../views/Banners.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Checkout from '../views/Checkout.vue';

// Vistas administrativas (Placeholders)
const AdminPlaceholder = { template: '<div class="p-8"><h1 class="text-2xl font-black italic uppercase tracking-tighter">Panel Administrativo - Próximamente...</h1></div>' };

const routes = [
  // RUTAS PÚBLICAS
  { path: '/', name: 'Home', component: Home, meta: { layout: 'public' } },
  { path: '/tienda', name: 'Shop', component: Shop, meta: { layout: 'public' } },
  { path: '/producto/:id', name: 'ProductDetail', component: ProductDetail, meta: { layout: 'public' } },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: { layout: 'public' } },
  { path: '/proyectos', name: 'Proyectos', component: Proyectos, meta: { layout: 'public' } },
  { path: '/nosotros', name: 'About', component: About, meta: { layout: 'public' } },
  { path: '/contacto', name: 'Contact', component: Contact, meta: { layout: 'public' } },
  { path: '/favoritos', name: 'Favoritos', component: Favoritos, meta: { layout: 'public' } },
  
  // RUTAS DE ACCESO (OCULTAS)
  { path: '/login', name: 'Login', component: Login, meta: { layout: 'blank' } },
  { path: '/registro', name: 'Register', component: Register, meta: { layout: 'blank' } },
  
  // RUTAS ADMINISTRATIVAS (PROTEGIDAS)
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true, layout: 'admin' } 
  },
  { path: '/dashboard/agregar-producto', name: 'AdminAddProduct', component: AddProduct, meta: { requiresAuth: true, layout: 'admin' } },
  { path: '/dashboard/productos', name: 'AdminProducts', component: AdminProducts, meta: { requiresAuth: true, layout: 'admin' } },
  { path: '/dashboard/pedidos', name: 'AdminOrders', component: AdminOrders, meta: { requiresAuth: true, layout: 'admin' } },
  { path: '/dashboard/clientes', name: 'AdminCustomers', component: AdminCustomers, meta: { requiresAuth: true, layout: 'admin' } },
  { path: '/dashboard/banners', name: 'AdminBanners', component: Banners, meta: { requiresAuth: true, layout: 'admin' } },
  { path: '/dashboard/contacto', name: 'AdminContact', component: AdminPlaceholder, meta: { requiresAuth: true, layout: 'admin' } },
  { path: '/dashboard/historial', name: 'AdminHistory', component: AdminPlaceholder, meta: { requiresAuth: true, layout: 'admin' } },
  { path: '/dashboard/pagos', name: 'AdminPayments', component: AdminPlaceholder, meta: { requiresAuth: true, layout: 'admin' } },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user_token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
