<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getOrders } from '../api/wordpress';

const orders = ref<any[]>([]);
const loading = ref(true);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await getOrders();
    orders.value = (response && Array.isArray(response.data)) ? response.data : [];
  } catch (err) {
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-600',
    processing: 'bg-blue-100 text-blue-600',
    onhold: 'bg-slate-100 text-slate-600',
    completed: 'bg-emerald-100 text-emerald-600',
    cancelled: 'bg-red-100 text-red-600',
    refunded: 'bg-red-100 text-red-600',
    failed: 'bg-red-100 text-red-600',
  };
  return colors[status.replace('-', '')] || 'bg-slate-100 text-slate-600';
};

onMounted(fetchOrders);
</script>

<template>
  <div class="space-y-8 pb-20">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Ventas</h4>
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Gestión de <span class="text-primary">Pedidos</span></h1>
      </div>
      <div class="flex gap-4">
        <button @click="fetchOrders" class="px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-all">
          Actualizar
        </button>
      </div>
    </header>

    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-50">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Pedido</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="5" class="px-8 py-6">
                <div class="h-4 bg-slate-50 rounded w-full"></div>
              </td>
            </tr>
            
            <tr v-else-if="orders.length === 0">
              <td colspan="5" class="px-8 py-20 text-center">
                <div class="flex flex-col items-center gap-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p class="text-xs font-black uppercase tracking-widest">No hay pedidos registrados</p>
                </div>
              </td>
            </tr>

            <tr v-for="order in orders" :key="order.id" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-6">
                <div>
                  <div class="text-sm font-black text-slate-900 tracking-tight">#{{ order.id }}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ order.line_items.length }} productos</div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="text-sm font-bold text-slate-700">{{ order.billing.first_name }} {{ order.billing.last_name }}</div>
                <div class="text-[10px] text-slate-400">{{ order.billing.email }}</div>
              </td>
              <td class="px-8 py-6 text-sm text-slate-500 font-medium">
                {{ new Date(order.date_created).toLocaleDateString('es-CL') }}
              </td>
              <td class="px-8 py-6">
                <span :class="getStatusColor(order.status)" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="text-sm font-black text-primary">$ {{ Number(order.total).toLocaleString('es-CL') }}</div>
                <div class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{{ order.payment_method_title }}</div>
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
