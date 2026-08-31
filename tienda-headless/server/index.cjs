require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Multer para subidas temporales
const upload = multer({ dest: 'uploads/' });

// Asegurar que la carpeta uploads existe para el despliegue en host
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('📁 Carpeta "uploads" creada para almacenamiento temporal.');
}

// Configuración de CORS dinámica
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  process.env.FRONTEND_URL,
  'https://tiendaserviduc.vercel.app', // Ejemplo de posible host
  'https://tienda.cortelasermetal.cl'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  exposedHeaders: ['x-wp-total', 'x-wp-totalpages']
}));

app.use(express.json());

// Endpoint de salud (Health Check) para la nube
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const WC_URL = process.env.WC_API_URL;
const VITE_WP_URL = process.env.VITE_WP_URL;

// ==== CUENTAS DEFINIDAS (MASTER) ====
const MASTER_USERS = {
  'Francisco': 'Empresa.2026',
  'Jesus': 'Empresa..2026'
};

// ==== AUTH PROXY ENDPOINTS ====

// Login
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`🔑 Intento de login: ${username}`);

  // Buscar usuario ignorando mayúsculas
  const foundUser = Object.keys(MASTER_USERS).find(
    u => u.toLowerCase() === username.toLowerCase()
  );

  if (foundUser && MASTER_USERS[foundUser] === password) {
    console.log(`✅ Login exitoso para maestro: ${foundUser}`);
    return res.json({
      token: 'master_token_' + Buffer.from(foundUser).toString('base64'),
      user_email: `${foundUser.toLowerCase()}@cortelasermetal.cl`,
      user_nicename: foundUser,
      user_display_name: foundUser
    });
  }

  console.log(`❌ Login fallido para: ${username}`);
  res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
});

// Registro de Usuario (Deshabilitado)
app.post('/auth/register', async (req, res) => {
  res.status(403).json({ error: 'El registro está deshabilitado temporalmente' });
});

// Validar Token
app.post('/auth/validate', async (req, res) => {
  const { token } = req.body;
  
  if (token && token.startsWith('master_token_')) {
    return res.json({ code: 'valid_token', data: { status: 200 } });
  }

  res.status(401).json({ error: 'Sesión no válida' });
});

// ==== WOOCOMMERCE PROXY ENDPOINTS ====

// GET Productos
app.get('/products', async (req, res) => {
  const targetUrl = `${WC_URL}/products`;
  console.log(`📦 Solicitando productos a: ${targetUrl}`);
  
  try {
    const response = await axios.get(targetUrl, {
      auth: { username: WC_KEY, password: WC_SECRET },
      params: req.query,
      timeout: 15000
    });
    
    console.log(`✅ ${response.data.length} productos recibidos de WooCommerce`);
    
    // Pasar headers de paginación si existen
    if (response.headers['x-wp-total']) {
      res.setHeader('x-wp-total', response.headers['x-wp-total']);
      res.setHeader('x-wp-totalpages', response.headers['x-wp-totalpages']);
    }
    
    res.json(response.data);
  } catch (err) {
    console.error(`❌ Error en WP API (${targetUrl}):`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

// GET Categorías de productos (DEBE IR ANTES DE /products/:id)
app.get('/products/categories', async (req, res) => {
  try {
    const response = await axios.get(`${WC_URL}/products/categories`, {
      auth: { username: WC_KEY, password: WC_SECRET },
      params: { ...req.query, per_page: 100 }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET Producto por ID
app.get('/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`${WC_URL}/products/${req.params.id}`, {
      auth: { username: WC_KEY, password: WC_SECRET }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// POST Crear Producto
app.post('/products', async (req, res) => {
  console.log('📝 Intentando crear producto en WooCommerce...');
  try {
    const { data } = await axios.post(`${WC_URL}/products`, req.body, {
      auth: { username: WC_KEY, password: WC_SECRET }
    });
    console.log(`✅ Producto creado: ${data.name} (ID: ${data.id})`);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al crear producto:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

// DELETE Eliminar Producto
app.delete('/products/:id', async (req, res) => {
  console.log(`🗑️ Intentando eliminar producto ID: ${req.params.id}`);
  try {
    const { data } = await axios.delete(`${WC_URL}/products/${req.params.id}`, {
      auth: { username: WC_KEY, password: WC_SECRET },
      params: { force: true } // Forzar eliminación definitiva
    });
    console.log(`✅ Producto eliminado ID: ${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al eliminar producto:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

// POST Crear Categoría
app.post('/products/categories', async (req, res) => {
  console.log('📁 Creando nueva categoría...');
  try {
    const { data } = await axios.post(`${WC_URL}/products/categories`, req.body, {
      auth: { username: WC_KEY, password: WC_SECRET }
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

// GET Pedidos (Orders)
app.get('/orders', async (req, res) => {
  console.log('📦 Solicitando listado de pedidos a WooCommerce...');
  try {
    const response = await axios.get(`${WC_URL}/orders`, {
      auth: { username: WC_KEY, password: WC_SECRET },
      params: req.query
    });
    
    if (response.headers['x-wp-total']) {
      res.setHeader('x-wp-total', response.headers['x-wp-total']);
      res.setHeader('x-wp-totalpages', response.headers['x-wp-totalpages']);
    }
    
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error al obtener pedidos:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

// GET Clientes (Customers)
app.get('/customers', async (req, res) => {
  console.log('👥 Solicitando listado de clientes a WooCommerce...');
  try {
    const response = await axios.get(`${WC_URL}/customers`, {
      auth: { username: WC_KEY, password: WC_SECRET },
      params: req.query
    });
    
    if (response.headers['x-wp-total']) {
      res.setHeader('x-wp-total', response.headers['x-wp-total']);
      res.setHeader('x-wp-totalpages', response.headers['x-wp-totalpages']);
    }
    
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error al obtener clientes:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

// POST Crear orden (checkout)
app.post('/orders', async (req, res) => {
  try {
    const { data } = await axios.post(`${WC_URL}/orders`, req.body, {
      auth: { username: WC_KEY, password: WC_SECRET }
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// POST Subir Media a WordPress
app.post('/media/upload', upload.single('file'), async (req, res) => {
  console.log('🖼️ Intentando subir imagen a WordPress...');
  
  if (!req.file) {
    return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
  }

  try {
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);
    
    const form = new FormData();
    form.append('file', fileStream, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // WordPress Media API URL
    const wpMediaUrl = `${process.env.VITE_WP_API}/media`;
    
    // IMPORTANTE: La subida de medios en WordPress requiere Contraseña de Aplicación de un usuario de WP.
    // Las llaves de WooCommerce (ck_... / cs_...) NO funcionan para este endpoint.
    const user = process.env.WP_USER;
    const pass = process.env.WP_APP_PASSWORD;
    
    if (!user || !pass) {
      console.error('❌ Error: WP_USER o WP_APP_PASSWORD no están configurados en el host.');
      return res.status(500).json({ 
        error: 'Configuración incompleta en el servidor para subida de medios.',
        details: 'Se requiere WP_USER y WP_APP_PASSWORD en las variables de entorno.' 
      });
    }
    
    const authHeader = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
    
    console.log(`📤 Subiendo imagen a WordPress (${wpMediaUrl}) como usuario: ${user}`);

    const response = await axios.post(wpMediaUrl, form, {
      headers: {
        'Authorization': authHeader,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // Eliminar archivo temporal
    fs.unlinkSync(filePath);

    res.json(response.data);
  } catch (err) {
    console.error('❌ Error al subir a WordPress:', err.response?.data || err.message);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

// DELETE Media en WordPress
app.delete('/media/:id', async (req, res) => {
  console.log(`🗑️ Eliminando media ID: ${req.params.id}`);
  try {
    const user = process.env.WP_USER;
    const pass = process.env.WP_APP_PASSWORD;
    const authHeader = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;

    const response = await axios.delete(`${process.env.VITE_WP_API}/media/${req.params.id}`, {
      headers: { 'Authorization': authHeader },
      params: { force: true }
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error al eliminar media:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🛒 WooCommerce Proxy corriendo en http://localhost:${PORT}`);
});
