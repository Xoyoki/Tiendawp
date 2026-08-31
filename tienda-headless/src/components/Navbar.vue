<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const publicNavItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Tienda', path: '/tienda' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Proyectos', path: '/proyectos' },
  { name: 'Contacto', path: '/contacto' }
];

const mobileMenuOpen = ref(false);
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-20 py-4 lg:py-6 flex items-center justify-between">
    <router-link to="/" class="flex items-center gap-3 group">
      <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
        TL
      </div>
      <span class="text-xl font-black tracking-tighter uppercase leading-tight">Corte Laser Metal</span>
    </router-link>

    <!-- Nav Escritorio -->
    <nav class="hidden lg:flex items-center gap-10">
      <router-link 
        v-for="item in publicNavItems" 
        :key="item.name" 
        :to="item.path"
        class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors"
        active-class="text-primary"
      >
        {{ item.name }}
      </router-link>
    </nav>

    <div class="flex items-center gap-6">
      <button @click="cart.toggleCart" class="relative text-slate-400 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span v-if="cart.totalItems > 0" class="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-primary/20">
          {{ cart.totalItems }}
        </span>
      </button>

      <router-link to="/favoritos" class="relative text-slate-400 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </router-link>
      
      <router-link to="/contacto" class="btn-primary rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-widest hidden lg:block shadow-xl shadow-primary/20">
        Cotizar Proyecto
      </router-link>
      
      <!-- Botón Menú Móvil -->
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden text-slate-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m4 6H4" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Menú Móvil -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 bg-white lg:hidden flex flex-col p-10 pt-32 gap-8 text-center">
        <router-link 
          v-for="item in publicNavItems" 
          :key="item.name" 
          :to="item.path"
          @click="mobileMenuOpen = false"
          class="text-2xl font-black uppercase tracking-tighter text-slate-400 active:text-primary"
        >
          {{ item.name }}
        </router-link>
        <button class="btn-primary py-5 rounded-3xl text-xs font-black uppercase tracking-[0.3em] mt-auto">
          Contactar por WhatsApp
        </button>
      </div>
    </transition>
  </header>
</template>

<style scoped>
@reference "../style.css";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
