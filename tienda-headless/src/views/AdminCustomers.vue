<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCustomers } from '../api/wordpress';

const customers = ref<any[]>([]);
const loading = ref(true);

const fetchCustomers = async () => {
  loading.value = true;
  try {
    const response = await getCustomers();
    customers.value = (response && Array.isArray(response.data)) ? response.data : [];
  } catch (err) {
    console.error('Error fetching customers:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCustomers);
</script>

<template>
  <div class="space-y-8 pb-20">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Comunidad</h4>
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Gestión de <span class="text-primary">Clientes</span></h1>
      </div>
      <button @click="fetchCustomers" class="px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-all">
        Actualizar Lista
      </button>
    </header>

    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-50">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ciudad</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pedidos</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Gasto Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="5" class="px-8 py-6">
                <div class="h-4 bg-slate-50 rounded w-full"></div>
              </td>
            </tr>
            
            <tr v-else-if="customers.length === 0">
              <td colspan="5" class="px-8 py-20 text-center">
                <div class="flex flex-col items-center gap-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p class="text-xs font-black uppercase tracking-widest">No hay clientes registrados</p>
                </div>
              </td>
            </tr>

            <tr v-for="customer in customers" :key="customer.id" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black text-xs">
                    {{ customer.first_name[0] }}{{ customer.last_name[0] }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 tracking-tight">{{ customer.first_name }} {{ customer.last_name }}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Usuario: {{ customer.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6 text-sm text-slate-500 font-medium">
                {{ customer.email }}
              </td>
              <td class="px-8 py-6 text-sm text-slate-500 font-medium">
                {{ customer.billing.city || 'N/A' }}
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  {{ customer.orders_count }} pedidos
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="text-sm font-black text-primary">$ {{ Number(customer.total_spent).toLocaleString('es-CL') }}</div>
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
