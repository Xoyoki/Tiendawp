import axios from 'axios';
import { API_CONFIG } from './config';

const wpApi = axios.create({
  baseURL: `${API_CONFIG.WP_URL}/wp-json/wp/v2`,
  timeout: API_CONFIG.TIMEOUT
});

const wcApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT
});

// ==== TYPES ====
export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  sku: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  meta_data: Array<{ key: string; value: string }>;
}

// ==== AUTH (vía proxy) ====
export const login = (credentials: any) =>
  wcApi.post('/auth/login', credentials).then(r => r.data);

export const register = (userData: any) =>
  wcApi.post('/auth/register', userData).then(r => r.data);

export const validateToken = (token: string) =>
  wcApi.post('/auth/validate', { token }).then(r => r.data);

// ==== WORDPRESS NATIVO ====
export const getPosts = (params = {}) =>
  wpApi.get<WPPost[]>('/posts', { params: { per_page: 12, ...params } }).then(r => r.data);

export const getPost = (slug: string) =>
  wpApi.get<WPPost[]>('/posts', { params: { slug } }).then(r => r.data[0]);

export const getPages = () =>
  wpApi.get<WPPost[]>('/pages', { params: { per_page: 100 } }).then(r => r.data);

export const getPage = (slug: string) =>
  wpApi.get<WPPost[]>('/pages', { params: { slug } }).then(r => r.data[0]);

export const getCategories = () =>
  wpApi.get('/categories');

// ==== WOOCOMMERCE (vía proxy) ====
export const getProducts = (params = {}) =>
  wcApi.get<WCProduct[]>('/products', { params: { per_page: 24, ...params } });

export const getProduct = (id: number | string) =>
  wcApi.get<WCProduct>(`/products/${id}`).then(r => r.data);

export const createProduct = (productData: any) =>
  wcApi.post<WCProduct>('/products', productData).then(r => r.data);

export const deleteProduct = (id: number) =>
  wcApi.delete(`/products/${id}`).then(r => r.data);

export const getProductCategories = () =>
  wcApi.get('/products/categories');

export const createProductCategory = (categoryData: { name: string }) =>
  wcApi.post('/products/categories', categoryData).then(r => r.data);

export const uploadMedia = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return wcApi.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
};

export const deleteMedia = (id: number | string) =>
  wcApi.delete(`/media/${id}`).then(r => r.data);

export const getOrders = (params = {}) =>
  wcApi.get<any[]>('/orders', { params: { per_page: 50, ...params } });

export const getCustomers = (params = {}) =>
  wcApi.get<any[]>('/customers', { params: { per_page: 50, ...params } });

export const createOrder = (orderData: any) =>
  wcApi.post('/orders', orderData).then(r => r.data);

export default { wpApi, wcApi };
