<script setup lang="ts">
const publicNavItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Tienda', path: '/tienda' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Proyectos', path: '/proyectos' },
  { name: 'Contacto', path: '/contacto' }
];
</script>

<template>
  <footer class="bg-slate-900 text-white pt-20 pb-10 px-6 lg:px-20 overflow-hidden relative">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic">TL</div>
          <span class="text-xl font-black tracking-tighter uppercase leading-tight text-white">Corte Laser<br/>Metal</span>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed font-medium">Expertos en manufactura de precisión y diseño industrial personalizado en Chile. Tecnología de punta para proyectos a medida.</p>
      </div>
      
      <div>
        <h4 class="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Navegación</h4>
        <ul class="space-y-4">
          <li v-for="item in publicNavItems" :key="item.name">
            <router-link :to="item.path" class="text-slate-400 hover:text-white text-sm font-bold transition-colors uppercase tracking-widest text-[10px]">{{ item.name }}</router-link>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Legal</h4>
        <ul class="space-y-4 text-slate-400 text-sm font-bold">
          <li><a href="#" class="hover:text-white transition-colors text-[10px] uppercase tracking-widest">Términos y Condiciones</a></li>
          <li><a href="#" class="hover:text-white transition-colors text-[10px] uppercase tracking-widest">Política de Privacidad</a></li>
          <li><a href="#" class="hover:text-white transition-colors text-[10px] uppercase tracking-widest">Envíos y Devoluciones</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Newsletter</h4>
        <p class="text-slate-400 text-xs font-bold mb-6 uppercase tracking-widest">Recibe ofertas y nuevos lanzamientos.</p>
        <div class="flex gap-2">
          <input type="email" placeholder="Tu email" class="bg-white/5 border-0 rounded-xl px-4 py-3 text-sm flex-grow ring-1 ring-white/10 focus:ring-primary focus:ring-2 placeholder:text-slate-600 outline-none transition-all" />
          <button class="bg-primary px-5 rounded-xl flex items-center justify-center transition-transform active:scale-90 shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
      <p>© 2026 CORTE LASER METAL. TODOS LOS DERECHOS RESERVADOS.</p>
      <div class="flex gap-8">
        <a href="#" class="hover:text-white transition-colors">Instagram</a>
        <a href="#" class="hover:text-white transition-colors">Facebook</a>
        <a href="#" class="hover:text-white transition-colors">LinkedIn</a>
      </div>
    </div>

    <!-- Decoración Background -->
    <div class="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
    <div class="absolute -left-20 bottom-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
  </footer>
</template>

<style scoped>
@reference "../style.css";
</style>
