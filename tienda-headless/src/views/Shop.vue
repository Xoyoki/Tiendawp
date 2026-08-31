<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProducts } from '../api/wordpress';
import { useCartStore } from '../stores/cart';
import type { WCProduct } from '../api/wordpress';

const cart = useCartStore();
const products = ref<WCProduct[]>([]);
const loading = ref(true);
const categories = ref(['Todos', 'Industrial', 'Decorativo', 'Arte', 'Muebles']);
const activeCategory = ref('Todos');

onMounted(async () => {
  try {
    const response = await getProducts({ per_page: 20 });
    products.value = response.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-white pb-24">
    <!-- Shop Header -->
    <header class="px-6 py-10 bg-slate-50 border-b border-slate-100">
      <h1 class="text-4xl font-black text-dark tracking-tighter uppercase mb-4">Catálogo</h1>
      <p class="text-sm font-medium text-slate-500 max-w-[250px]">Encuentra la pieza perfecta cortada con precisión láser.</p>
    </header>

    <!-- Categories Filter (Horizontal Scroll) -->
    <div class="px-6 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-50 flex gap-3 overflow-x-auto no-scrollbar">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="activeCategory = cat"
        :class="activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500'"
        class="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Product Grid -->
    <section class="px-6 py-8">
      <div v-if="loading" class="grid grid-cols-2 gap-4">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="aspect-square bg-slate-100 rounded-2xl mb-4"></div>
          <div class="h-3 bg-slate-100 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <router-link 
          v-for="product in products" 
          :key="product.id" 
          :to="`/producto/${product.id}`"
          class="flex flex-col group"
        >
          <div class="aspect-[4/5] relative overflow-hidden bg-slate-50 rounded-3xl border border-slate-100">
            <img 
              v-if="product.images.length" 
              :src="product.images[0].src" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-green-700/30">
               <span class="text-[8px] font-mono mb-2 uppercase">SKU: {{ product.slug }}</span>
               <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <button class="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur shadow-sm rounded-xl flex items-center justify-center text-dark">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div class="mt-4 px-1">
            <h3 class="text-xs font-black text-dark uppercase tracking-tight line-clamp-2 leading-tight mb-2">{{ product.name }}</h3>
            <div class="flex items-center justify-between">
              <span class="text-sm font-black text-primary" v-html="product.price_html"></span>
              <button 
                @click.prevent="cart.addItem(product)"
                class="text-[10px] font-black uppercase text-dark border-b-2 border-primary pb-0.5"
              >
                Añadir
              </button>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Float Filter Button (Mobile) -->
    <button class="fixed bottom-24 right-6 w-14 h-14 bg-dark text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 md:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
@reference "../style.css";

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
