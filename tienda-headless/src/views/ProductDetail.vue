<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getProduct } from '../api/wordpress';
import { useCartStore } from '../stores/cart';
import type { WCProduct } from '../api/wordpress';

const route = useRoute();
const cart = useCartStore();
const product = ref<WCProduct | null>(null);
const loading = ref(true);
const activeImage = ref(0);
const quantity = ref(1);

const contentBlocks = computed(() => {
  if (!product.value?.meta_data) return [];
  const meta = product.value.meta_data.find(m => m.key === '_content_blocks');
  try {
    return meta ? JSON.parse(meta.value) : [];
  } catch (e) {
    return [];
  }
});

onMounted(async () => {
  try {
    const id = route.params.id as string;
    product.value = await getProduct(id);
  } catch (err) {
    console.error('Error loading product:', err);
  } finally {
    loading.value = false;
  }
});

const addToCart = () => {
  if (product.value) {
    cart.addItem(product.value);
  }
};
</script>

<template>
  <div class="min-h-screen bg-white pb-20">
    <div v-if="loading" class="max-w-7xl mx-auto px-6 py-20 animate-pulse">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="aspect-square bg-slate-100 rounded-[3rem]"></div>
        <div class="space-y-6">
          <div class="h-10 bg-slate-100 rounded-xl w-3/4"></div>
          <div class="h-6 bg-slate-100 rounded-xl w-1/4"></div>
          <div class="h-32 bg-slate-100 rounded-3xl w-full"></div>
        </div>
      </div>
    </div>

    <div v-else-if="product" class="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        <!-- Galerí­a de Imágenes -->
        <div class="space-y-6">
          <div class="aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 relative group">
            <img 
              v-if="product.images.length"
              :src="product.images[activeImage].src" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-4">
            <button 
              v-for="(img, index) in product.images" 
              :key="index"
              @click="activeImage = index"
              class="aspect-square rounded-2xl overflow-hidden border-2 transition-all"
              :class="activeImage === index ? 'border-primary shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img :src="img.src" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Información del Producto -->
        <div class="flex flex-col">
          <div class="mb-10">
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">
              {{ product.categories[0]?.name || 'Producto' }}
            </h4>
            <h1 class="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-6">
              {{ product.name }}
            </h1>
            <div class="text-3xl font-black text-primary tracking-tighter" v-html="product.price_html"></div>
          </div>

          <div class="prose prose-slate prose-sm mb-12" v-html="product.description"></div>

          <div class="space-y-8 mt-auto">
            <div class="flex items-center gap-6">
              <div class="flex items-center bg-slate-100 rounded-2xl p-1">
                <button @click="quantity > 1 && quantity--" class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-dark transition-colors">-</button>
                <span class="w-10 text-center text-sm font-black">{{ quantity }}</span>
                <button @click="quantity++" class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-dark transition-colors">+</button>
              </div>
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                SKU: {{ product.sku || 'SIN SKU' }}
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                @click="addToCart"
                class="flex-grow btn-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Añadir al Carrito
              </button>
              <button class="px-10 py-5 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 transition-all">
                Cotizar Personalizado
              </button>
            </div>
          </div>

          <!-- Características Rápidas -->
          <div class="mt-16 pt-10 border-t border-slate-50 grid grid-cols-2 gap-8">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h5 class="text-[9px] font-black uppercase tracking-widest mb-1">Corte de Precisión</h5>
                <p class="text-[8px] text-slate-400 font-bold leading-tight">Mínima tolerancia garantizada</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h5 class="text-[9px] font-black uppercase tracking-widest mb-1">Material Premium</h5>
                <p class="text-[8px] text-slate-400 font-bold leading-tight">Acero y aluminio certificado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloques de Contenido Adicional -->
    <div v-if="contentBlocks.length > 0" class="max-w-4xl mx-auto px-6 py-20 space-y-24">
      <div v-for="block in contentBlocks" :key="block.id" class="animate-fade-in-up">
        
        <!-- Bloque de Texto -->
        <div v-if="block.type === 'text'" class="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
          {{ block.content }}
        </div>

        <!-- Bloque de Imagen / GIF -->
        <div v-else-if="block.type === 'image' || block.type === 'gif'" class="rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
          <img :src="block.content" class="w-full h-auto object-cover" />
        </div>

        <!-- Bloque de Video -->
        <div v-else-if="block.type === 'video'" class="rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl aspect-video bg-black">
          <video :src="block.content" controls class="w-full h-full object-cover"></video>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
