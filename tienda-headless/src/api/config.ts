/**
 * Configuración centralizada del entorno
 * Permite que el código sea "progresivo": 
 * Se adapta automáticamente si estamos en Local o en Nube.
 */

const isProd = import.meta.env.PROD;

/**
 * URL del Proxy Backend.
 * Para despliegue en host, asegúrate de configurar VITE_API_URL en tu panel de control (ej. Vercel, Render).
 */
export const API_CONFIG = {
  // Siempre priorizar la URL del host configurada en el entorno
  BASE_URL: import.meta.env.VITE_API_URL || (isProd ? '' : '/api'),
  
  WP_URL: import.meta.env.VITE_WP_URL || 'https://admin.cortelasermetal.cl',
  
  // Timeout estándar para evitar bloqueos en la nube
  TIMEOUT: 30000,
};
