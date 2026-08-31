<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';

const route = useRoute();
const auth = useAuthStore();
const cart = useCartStore();

// Determinamos el layout basado en la metadata de la ruta
const currentLayout = computed(() => route.meta.layout || 'public');

// Items para el Sidebar Administrativo (Replica de la imagen)
const adminSidebarItems = [
  { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', path: '/dashboard' },
  { name: 'Agregar producto', icon: 'M12 4v16m8-8H4', path: '/dashboard/agregar-producto' },
  { name: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', path: '/dashboard/productos' },
  { name: 'Pedidos', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', path: '/dashboard/pedidos' },
  { name: 'Clientes', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', path: '/dashboard/clientes' },
  { name: 'Banners', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/dashboard/banners' },
  { name: 'Datos de contacto', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', path: '/dashboard/contacto' },
  { name: 'Compras / Historial', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', path: '/dashboard/historial' },
  { name: 'Pagos y abonos', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', path: '/dashboard/pagos' }
];
</script>

<template>
  <div class="min-h-screen font-sans antialiased text-slate-900 bg-white selection:bg-primary selection:text-white">
    <CartDrawer />
    
    <!-- 1. LAYOUT PÚBLICO (Tienda) -->
    <template v-if="currentLayout === 'public'">
      <Navbar />
      <main class="min-h-[70vh]">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <Footer />
    </template>

    <!-- 2. LAYOUT ADMINISTRATIVO (Dashboard) -->
    <template v-else-if="currentLayout === 'admin'">
      <div class="flex min-h-screen bg-slate-50">
        <aside class="hidden lg:flex w-72 h-screen sticky top-0 bg-white border-r border-slate-100 flex-col z-50">
          <div class="p-8">
            <router-link to="/" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">
                TL
              </div>
              <span class="text-lg font-black tracking-tighter uppercase leading-tight text-slate-900">Corte Laser Metal</span>
            </router-link>
          </div>

          <nav class="flex-grow px-4 space-y-1">
            <router-link 
              v-for="item in adminSidebarItems" 
              :key="item.name" 
              :to="item.path"
              class="admin-nav-link"
              active-class="active"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
              </svg>
              {{ item.name }}
            </router-link>
          </nav>

          <div class="p-6 space-y-4">
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">¿Necesitas ayuda?</p>
              <p class="text-[11px] font-bold text-slate-600 leading-relaxed">Contáctanos por WhatsApp</p>
            </div>
            
            <button @click="auth.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div class="flex-grow flex flex-col min-h-screen relative overflow-x-hidden">
          <header class="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-12 py-6 flex items-center justify-between border-b border-slate-50">
            <div>
              <h2 class="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                Hola, {{ auth.user?.displayName || 'Francisco' }} 👋
              </h2>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Panel Administrativo</p>
            </div>

            <div class="flex items-center gap-6">
              <button class="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-2 right-2 w-4 h-4 bg-primary text-[8px] font-black text-white rounded-full flex items-center justify-center border-2 border-white">3</span>
              </button>
              
              <div class="flex items-center gap-3 pl-6 border-l border-slate-100">
                <div class="flex flex-col items-end">
                  <span class="text-xs font-black uppercase text-slate-900">{{ auth.user?.displayName || 'Admin' }}</span>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Master</span>
                </div>
                <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                  {{ auth.user?.displayName?.charAt(0) || 'A' }}
                </div>
              </div>
            </div>
          </header>

          <main class="flex-grow p-6 lg:p-12">
            <router-view v-slot="{ Component }">
              <transition name="page" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </main>
        </div>
      </div>
    </template>

    <!-- 3. LAYOUT BLANK (Login/Register) -->
    <template v-else>
      <main class="min-h-screen bg-slate-50 flex items-center justify-center">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </template>

    <!-- Botón Flotante WhatsApp (Solo en layout público) -->
    <a 
      v-if="currentLayout === 'public'"
      href="https://wa.me/56912345678" 
      target="_blank" 
      class="whatsapp-float"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.89 4.44-9.892 9.886-.001 2.125.593 3.456 1.574 5.497l-.994 3.635 3.912-.982zM17.476 14.39c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
    </a>
  </div>
</template>

<style scoped>
@reference "./style.css";

.admin-nav-link {
  @apply flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all duration-300;
}
.admin-nav-link.active {
  @apply bg-primary text-white shadow-xl shadow-primary/20 translate-x-1;
}

.page-enter-active, .page-leave-active { transition: all 0.25s ease-out; }
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; transform: translateY(-10px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.whatsapp-float {
  @apply fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform;
}
</style>
