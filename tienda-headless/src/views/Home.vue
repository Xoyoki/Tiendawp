<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProducts } from '../api/wordpress';
import type { WCProduct } from '../api/wordpress';

const products = ref<WCProduct[]>([]);
const loading = ref(true);

// Banners (esto luego vendrá de una API o CMS)
const banners = ref([
  {
    id: 1,
    title: 'Precisión Industrial',
    subtitle: 'Corte Láser en Metal',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=industrial+laser+cutting+metal+machine+working+close+up+sparks+modern+factory+premium+lighting&image_size=landscape_16_9',
    cta: 'Ver Servicios'
  },
  {
    id: 2,
    title: 'Diseños Personalizados',
    subtitle: 'Arte en Acero y Aluminio',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=custom+metal+art+laser+cut+decorative+panels+modern+interior+design&image_size=landscape_16_9',
    cta: 'Explorar Tienda'
  }
]);

const currentBanner = ref(0);

onMounted(async () => {
  try {
    const response = await getProducts({ per_page: 6 });
    if (response && response.data) {
      products.value = Array.isArray(response.data) ? response.data : [];
    } else {
      console.warn('Respuesta de API vací­a en Home');
      products.value = [];
    }
  } catch (err) {
    console.error('Error cargando productos en Home:', err);
    products.value = [];
  } finally {
    loading.value = false;
  }
});

const nextBanner = () => {
  currentBanner.value = (currentBanner.value + 1) % banners.value.length;
};
</script>

<template>
  <div class="pb-20">
    <!-- 1. Hero Banner Slider (Mobile First) -->
    <section class="relative h-[80vh] md:h-[90vh] overflow-hidden bg-dark">
      <div 
        v-for="(banner, index) in banners" 
        :key="banner.id"
        class="absolute inset-0 transition-all duration-1000 ease-in-out"
        :class="[
          currentBanner === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
        ]"
      >
        <img :src="banner.image" class="w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent"></div>
        
        <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-20 lg:p-32 max-w-7xl mx-auto">
          <h4 class="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6 animate-fade-in-up">{{ banner.subtitle }}</h4>
          <h2 class="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-10 animate-fade-in-up delay-100">
            {{ banner.title.split(' ')[0] }} <br/>
            <span class="text-primary italic">{{ banner.title.split(' ').slice(1).join(' ') }}</span>
          </h2>
          <div class="flex flex-col md:flex-row gap-6 animate-fade-in-up delay-200">
            <router-link to="/tienda" class="btn-primary px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20">
              {{ banner.cta }}
            </router-link>
            <router-link to="/contacto" class="px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-white/20 text-white hover:bg-white hover:text-dark transition-all backdrop-blur-md">
              Cotizar Ahora
            </router-link>
          </div>
        </div>
      </div>

      <!-- Slider Controls -->
      <div class="absolute bottom-10 right-8 md:right-20 flex gap-4 z-20">
        <button @click="nextBanner" class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <!-- Indicators -->
      <div class="absolute bottom-12 left-8 md:left-20 flex gap-3 z-20">
        <div 
          v-for="(_, i) in banners" 
          :key="i"
          @click="currentBanner = i"
          class="h-1 rounded-full transition-all duration-500 cursor-pointer"
          :class="currentBanner === i ? 'w-12 bg-primary' : 'w-6 bg-white/20'"
        ></div>
      </div>
    </section>

    <!-- 2. Inicio / Introduction Section -->
    <section class="px-6 py-24 lg:py-40 bg-white">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-10">
          <div class="space-y-4">
            <h4 class="text-xs font-black uppercase tracking-[0.3em] text-primary">Sobre Nosotros</h4>
            <h2 class="text-4xl lg:text-6xl font-black text-dark tracking-tighter uppercase leading-[0.9]">
              Tecnología Láser de <br/> <span class="text-primary italic">Alta Precisión</span>
            </h2>
          </div>
          <p class="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
            Especialistas en el corte y grabado láser de diversos metales. Ofrecemos soluciones personalizadas para la industria, arquitectura y diseño de interiores.
          </p>
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-2">
              <div class="text-3xl font-black text-dark tracking-tighter">0.1mm</div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Tolerancia de Corte</p>
            </div>
            <div class="space-y-2">
              <div class="text-3xl font-black text-dark tracking-tighter">24Hrs</div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Cotización Rápida</p>
            </div>
          </div>
          <div class="pt-6">
            <router-link to="/nosotros" class="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-dark">
              Ver más sobre nosotros
              <div class="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7-7 7" />
                </svg>
              </div>
            </router-link>
          </div>
        </div>
        
        <div class="relative">
          <div class="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden rotate-2 group">
            <img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern+laser+cut+metal+art+pieces+decor+minimalist&image_size=portrait_4_3" 
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <!-- Floating badge -->
          <div class="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 -rotate-3">
             <div class="text-2xl font-black text-primary tracking-tighter">100%</div>
             <div class="text-[8px] font-black uppercase tracking-widest text-slate-400">Hecho en Chile</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Featured Products -->
    <section class="px-6 py-24 lg:py-40 bg-slate-50 border-y border-slate-100">
      <div class="max-w-7xl mx-auto space-y-20">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div class="space-y-4">
            <h4 class="text-xs font-black uppercase tracking-[0.3em] text-primary">Nuestra Tienda</h4>
            <h2 class="text-4xl lg:text-6xl font-black text-dark tracking-tighter uppercase leading-[0.9]">
              Productos <br/> <span class="text-primary italic">Destacados</span>
            </h2>
          </div>
          <router-link to="/tienda" class="btn-primary px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">
            Ver Catálogo Completo
          </router-link>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse space-y-6">
            <div class="aspect-square bg-slate-200 rounded-[2.5rem]"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id" class="group">
            <div class="aspect-[4/5] bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500 overflow-hidden relative">
              <img 
                v-if="product.images.length" 
                :src="product.images[0].src" 
                class="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-700"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-primary/20">
                <span class="text-[8px] font-mono mb-2 uppercase tracking-widest">SKU: {{ product.slug.slice(0, 8) }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div class="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                <router-link :to="`/producto/${product.id}`" class="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl text-center translate-y-4 group-hover:translate-y-0 transition-transform">
                  Ver Detalles
                </router-link>
              </div>
            </div>
            
            <div class="mt-8 text-center space-y-2">
              <h3 class="text-xs font-black uppercase tracking-widest text-dark">{{ product.name }}</h3>
              <p class="text-primary font-black tracking-tighter">$ {{ Number(product.price).toLocaleString('es-CL') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Call to Action -->
    <section class="px-6 py-32 bg-dark relative overflow-hidden">
      <div class="max-w-4xl mx-auto text-center relative z-10 space-y-12">
        <h2 class="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          ¿Listo para iniciar tu <br/> <span class="text-primary italic">próximo gran proyecto?</span>
        </h2>
        <div class="flex flex-col md:flex-row items-center justify-center gap-6">
          <router-link to="/contacto" class="btn-primary px-12 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/40">
            Solicitar Cotización
          </router-link>
          <a href="#" class="text-white text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-primary pb-2 hover:text-primary transition-colors">
            Hablar por WhatsApp
          </a>
        </div>
      </div>
      
      <!-- Background Decor -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px]"></div>
    </section>
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
