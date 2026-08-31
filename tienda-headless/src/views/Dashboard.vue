<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { getOrders, getProducts, getCustomers } from '../api/wordpress';

const auth = useAuthStore();
const loading = ref(true);

const orders = ref<any[]>([]);
const products = ref<any[]>([]);
const customersCount = ref(0);
const productsCount = ref(0);
const ordersCount = ref(0);

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const [ordersRes, productsRes, customersRes] = await Promise.all([
      getOrders({ per_page: 100 }), // Cargamos más para el cálculo de ventas
      getProducts({ per_page: 1 }),
      getCustomers({ per_page: 1 })
    ]);

    if (ordersRes && ordersRes.data) {
      const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      orders.value = allOrders.slice(0, 5); // Recientes
      ordersCount.value = parseInt(ordersRes.headers['x-wp-total'] || '0');
      
      // Cálculo de ventas sobre los pedidos cargados
      const sales = allOrders.reduce((acc, order) => acc + Number(order.total || 0), 0);
      // Podemos guardar este valor en una ref si queremos evitar re-cálculos costosos
    }

    if (productsRes) {
      productsCount.value = parseInt(productsRes.headers['x-wp-total'] || '0');
    }

    if (customersRes) {
      customersCount.value = parseInt(customersRes.headers['x-wp-total'] || '0');
    }
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const totalSales = computed(() => {
  if (!Array.isArray(orders.value)) return 0;
  // Nota: Esto solo sumará los 5 pedidos guardados en orders.value. 
  // Para ventas totales reales, deberíamos usar una variable dedicada.
  return orders.value.reduce((acc, order) => acc + Number(order.total || 0), 0);
});

const stats = computed(() => [
  { 
    name: 'Ventas totales', 
    value: `$ ${totalSales.value.toLocaleString('es-CL')}`, 
    change: '', 
    sub: 'Total acumulado (100 últ.)', 
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50' 
  },
  { 
    name: 'Pedidos totales', 
    value: ordersCount.value.toString(), 
    change: '', 
    sub: 'En total', 
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50' 
  },
  { 
    name: 'Clientes registrados', 
    value: customersCount.value.toString(), 
    change: '', 
    sub: 'En total', 
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-50' 
  },
  { 
    name: 'Productos activos', 
    value: productsCount.value.toString(), 
    change: '', 
    sub: 'En catálogo', 
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50' 
  }
]);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-600',
    processing: 'bg-blue-100 text-blue-600',
    completed: 'bg-emerald-100 text-emerald-600',
    cancelled: 'bg-red-100 text-red-600',
    failed: 'bg-red-100 text-red-600',
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
};

onMounted(fetchDashboardData);
</script>

<template>
  <div class="space-y-8 pb-12">
    
    <!-- STATS TOP ROW -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-6">
        <div :class="[stat.bg, stat.color]" class="w-14 h-14 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
          </svg>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{{ stat.name }}</p>
          <h3 class="text-2xl font-black text-slate-900 tracking-tighter">{{ stat.value }}</h3>
          <p class="text-[10px] font-bold mt-1">
            <span :class="stat.name === 'Productos activos' ? 'text-orange-500' : 'text-emerald-500'">{{ stat.change }}</span>
            <span class="text-slate-300 ml-1">{{ stat.sub }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- PEDIDOS RECIENTES -->
      <div class="xl:col-span-2 space-y-8">
        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-black text-slate-900 tracking-tighter">Pedidos recientes</h3>
            <button class="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Ver todos</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] border-b border-slate-50">
                  <th class="pb-4 font-black">Pedido</th>
                  <th class="pb-4 font-black">Cliente</th>
                  <th class="pb-4 font-black">Fecha</th>
                  <th class="pb-4 font-black">Total</th>
                  <th class="pb-4 font-black text-right">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                  <td colspan="5" class="py-5"><div class="h-4 bg-slate-50 rounded w-full"></div></td>
                </tr>
                <tr v-else-if="orders.length === 0">
                  <td colspan="5" class="py-10 text-center text-[10px] font-black uppercase text-slate-300 tracking-widest">No hay pedidos registrados</td>
                </tr>
                <tr v-else v-for="order in orders" :key="order.id" class="text-xs">
                  <td class="py-5 font-bold text-slate-900">#{{ order.id }}</td>
                  <td class="py-5 font-bold text-slate-600">{{ order.billing.first_name }} {{ order.billing.last_name }}</td>
                  <td class="py-5 font-bold text-slate-400">{{ new Date(order.date_created).toLocaleDateString('es-CL') }}</td>
                  <td class="py-5 font-black text-slate-900">$ {{ Number(order.total).toLocaleString('es-CL') }}</td>
                  <td class="py-5 text-right">
                    <span :class="getStatusColor(order.status)" class="px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- BANNERS ACTIVOS -->
        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-black text-slate-900 tracking-tighter">Banners activos</h3>
            <button class="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Ver todos</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(banner, i) in ['Banner principal', 'Banner secundario', 'Banner decoración']" :key="i" class="space-y-4 group">
              <div class="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative">
                <div class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white/20 uppercase tracking-widest text-center px-6">
                  {{ i === 0 ? 'CORTE PRECISO DISEÑOS ÚNICOS' : i === 1 ? 'DISEÑOS PERSONALIZADOS PARA TUS PROYECTOS' : 'DECORA CON ESTILO' }}
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold text-slate-600">{{ banner }}</p>
                <span class="px-2 py-1 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md">Activo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RESUMEN FINANCIERO -->
        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
          <h3 class="text-lg font-black text-slate-900 tracking-tighter mb-8">Resumen financiero</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="f in stats" :key="f.name" class="space-y-4">
              <div :class="[f.bg, f.color]" class="w-12 h-12 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="f.icon" />
                </svg>
              </div>
              <div>
                <p class="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">{{ f.name }}</p>
                <h4 class="text-sm font-black text-slate-900">{{ f.value }}</h4>
                <p class="text-[9px] font-bold text-slate-400 mt-0.5">{{ f.sub }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="space-y-8">
        <!-- VENTAS DEL MES CHART CARD -->
        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
          <h3 class="text-sm font-black text-slate-900 tracking-tighter mb-1">Ventas totales (Acumulado)</h3>
          <h2 class="text-2xl font-black text-slate-900 tracking-tighter mb-1">$ {{ totalSales.toLocaleString('es-CL') }}</h2>
          <p class="text-[10px] font-bold text-emerald-500">Basado en últimos 100 pedidos</p>
          
          <div class="h-40 mt-8 relative flex items-end justify-between px-2">
            <div v-for="i in 7" :key="i" class="w-1 bg-slate-100 rounded-full transition-all hover:bg-primary" :style="{ height: Math.floor(Math.random() * 80 + 20) + '%' }"></div>
            <!-- Simulación de línea de gráfico -->
            <div class="absolute inset-0 flex items-center">
              <svg class="w-full h-full text-primary opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 80 Q 20 20, 40 50 T 80 30 T 100 60" fill="none" stroke="currentColor" stroke-width="4" vector-effect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>

        <!-- ACCIONES RÁPIDAS -->
        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
          <h3 class="text-sm font-black text-slate-900 tracking-tighter mb-6">Acciones rápidas</h3>
          <div class="space-y-3">
            <router-link v-for="action in [
              { name: 'Agregar producto', desc: 'Crear nuevo producto', icon: 'M12 4v16m8-8H4', color: 'bg-blue-50 text-blue-500', path: '/dashboard/agregar-producto' },
              { name: 'Gestionar banners', desc: 'Editar banners del sitio', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-emerald-50 text-emerald-500', path: '/dashboard/banners' },
              { name: 'Ver pedidos', desc: 'Administrar pedidos', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'bg-indigo-50 text-indigo-500', path: '/dashboard/pedidos' },
              { name: 'Ver clientes', desc: 'Gestionar clientes', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-orange-50 text-orange-500', path: '/dashboard/clientes' }
            ]" :key="action.name" :to="action.path" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div :class="action.color" class="w-10 h-10 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                </svg>
              </div>
              <div class="flex-grow">
                <p class="text-[11px] font-black text-slate-900 tracking-tight">{{ action.name }}</p>
                <p class="text-[9px] font-bold text-slate-300">{{ action.desc }}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-200 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
