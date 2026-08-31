<script setup lang="ts">
import { ref } from 'vue';

const banners = ref([
  {
    id: 1,
    title: 'Precisión Industrial',
    subtitle: 'Corte Láser en Metal',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=industrial+laser+cutting+metal+machine+working+close+up+sparks+modern+factory+premium+lighting&image_size=landscape_16_9',
    active: true
  },
  {
    id: 2,
    title: 'Diseños Personalizados',
    subtitle: 'Arte en Acero y Aluminio',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=custom+metal+art+laser+cut+decorative+panels+modern+interior+design&image_size=landscape_16_9',
    active: true
  }
]);

const handleToggle = (id: number) => {
  const banner = banners.value.find(b => b.id === id);
  if (banner) banner.active = !banner.active;
};
</script>

<template>
  <div class="space-y-10 pb-20">
    <header>
      <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Diseño Visual</h4>
      <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Gestión de <span class="text-primary">Banners</span></h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="banner in banners" :key="banner.id" class="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
        <div class="aspect-[16/9] relative overflow-hidden bg-slate-900">
          <img :src="banner.image" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6">
            <h4 class="text-[8px] font-black uppercase tracking-widest text-primary mb-1">{{ banner.subtitle }}</h4>
            <h3 class="text-xl font-black text-white uppercase tracking-tighter">{{ banner.title }}</h3>
          </div>
          
          <div class="absolute top-6 right-6">
            <button 
              @click="handleToggle(banner.id)"
              :class="banner.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'"
              class="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg transition-all"
            >
              {{ banner.active ? 'Activo' : 'Inactivo' }}
            </button>
          </div>
        </div>
        
        <div class="p-8 flex items-center justify-between bg-white">
          <div class="flex gap-4">
            <button class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <button class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-dark transition-all">
            Cambiar Imagen
          </button>
        </div>
      </div>

      <!-- Add New Banner -->
      <div class="aspect-[16/9] md:h-full bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center group hover:border-primary transition-colors cursor-pointer">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">Agregar Banner</h3>
        <p class="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-tighter">Máximo 5 banners activos</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";
</style>
