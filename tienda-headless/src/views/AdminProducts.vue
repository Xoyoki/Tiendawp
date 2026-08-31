<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProducts, deleteProduct } from '../api/wordpress';
import type { WCProduct } from '../api/wordpress';

const products = ref<WCProduct[]>([]);
const loading = ref(true);
const deletingId = ref<number | null>(null);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await getProducts({ per_page: 50 });
    products.value = (response && Array.isArray(response.data)) ? response.data : [];
  } catch (err) {
    console.error('Error fetching products:', err);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
  
  deletingId.value = id;
  try {
    await deleteProduct(id);
    products.value = products.value.filter(p => p.id !== id);
  } catch (err) {
    console.error('Error deleting product:', err);
    alert('No se pudo eliminar el producto');
  } finally {
    deletingId.value = null;
  }
};

onMounted(fetchProducts);
</script>

<template>
  <div class="space-y-8 pb-20">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Inventario</h4>
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Listado de <span class="text-primary">Productos</span></h1>
      </div>
      <router-link to="/dashboard/agregar-producto" class="btn-primary px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Producto
      </router-link>
    </header>

    <!-- Table Section -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-50">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">SKU</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Precio</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="5" class="px-8 py-6">
                <div class="h-4 bg-slate-50 rounded w-full"></div>
              </td>
            </tr>
            
            <tr v-else-if="products.length === 0">
              <td colspan="5" class="px-8 py-20 text-center">
                <div class="flex flex-col items-center gap-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p class="text-xs font-black uppercase tracking-widest">No hay productos registrados</p>
                </div>
              </td>
            </tr>

            <tr v-for="product in products" :key="product.id" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                    <img v-if="product.images.length" :src="product.images[0].src" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 tracking-tight">{{ product.name }}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: #{{ product.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{{ product.sku || 'SIN SKU' }}</span>
              </td>
              <td class="px-8 py-6">
                <div class="text-sm font-black text-primary" v-html="product.price_html"></div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-wrap gap-1">
                  <span v-for="cat in product.categories" :key="cat.id" class="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {{ cat.name }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDelete(product.id)"
                    :disabled="deletingId === product.id"
                    class="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm disabled:opacity-50"
                  >
                    <svg v-if="deletingId !== product.id" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";
</style>
