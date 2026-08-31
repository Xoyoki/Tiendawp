<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { createOrder } from '../api/wordpress';

const router = useRouter();
const cart = useCartStore();

const step = ref(1);
const loading = ref(false);
const orderSuccess = ref<any>(null);

const form = ref({
  first_name: '',
  last_name: '',
  address_1: '',
  city: '',
  email: '',
  phone: '',
  payment_method: 'bacs',
  payment_method_title: 'Transferencia Bancaria'
});

const isFormValid = computed(() => {
  return form.value.first_name && form.value.last_name && form.value.email && form.value.address_1;
});

const handleCheckout = async () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  try {
    const orderData = {
      payment_method: form.value.payment_method,
      payment_method_title: form.value.payment_method_title,
      set_paid: false,
      billing: form.value,
      shipping: form.value,
      line_items: cart.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };
    
    const response = await createOrder(orderData);
    orderSuccess.value = response;
    cart.clearCart();
    step.value = 3;
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Error al procesar el pedido. Inténtalo de nuevo.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-20 pt-10">
    <div class="max-w-7xl mx-auto px-6">
      <header class="text-center mb-16">
        <h1 class="text-4xl lg:text-6xl font-black text-dark tracking-tighter uppercase italic">Finalizar <span class="text-primary">Compra</span></h1>
        <div class="flex items-center justify-center gap-4 mt-8">
          <div class="flex items-center gap-2">
            <div :class="step >= 1 ? 'bg-primary text-white' : 'bg-white text-slate-300'" class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm transition-all">1</div>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Envío</span>
          </div>
          <div class="w-12 h-px bg-slate-200"></div>
          <div class="flex items-center gap-2">
            <div :class="step >= 2 ? 'bg-primary text-white' : 'bg-white text-slate-300'" class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm transition-all">2</div>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Pago</span>
          </div>
          <div class="w-12 h-px bg-slate-200"></div>
          <div class="flex items-center gap-2">
            <div :class="step >= 3 ? 'bg-primary text-white' : 'bg-white text-slate-300'" class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm transition-all">3</div>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Confirmación</span>
          </div>
        </div>
      </header>

      <div v-if="step < 3" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Formulario -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Datos de Envío -->
          <section v-if="step === 1" class="bg-white p-8 lg:p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 animate-fade-in">
            <h3 class="text-xl font-black uppercase tracking-tighter">Información de Envío</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
                <input v-model="form.first_name" type="text" class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Apellidos</label>
                <input v-model="form.last_name" type="text" class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dirección</label>
                <input v-model="form.address_1" type="text" class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ciudad</label>
                <input v-model="form.city" type="text" class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono</label>
                <input v-model="form.phone" type="tel" class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <input v-model="form.email" type="email" class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
            <button @click="step = 2" :disabled="!isFormValid" class="w-full btn-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-50 transition-all shadow-xl shadow-primary/20">
              Continuar al Pago
            </button>
          </section>

          <!-- Método de Pago -->
          <section v-if="step === 2" class="bg-white p-8 lg:p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
              <button @click="step = 1" class="text-slate-400 hover:text-dark transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 class="text-xl font-black uppercase tracking-tighter">Método de Pago</h3>
            </div>
            
            <div class="space-y-4">
              <label class="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 cursor-pointer hover:border-primary transition-all group">
                <div class="flex items-center gap-4">
                  <input type="radio" v-model="form.payment_method" value="bacs" class="w-5 h-5 text-primary focus:ring-primary" />
                  <div>
                    <span class="text-xs font-black uppercase tracking-widest">Transferencia Bancaria</span>
                    <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Pago manual tras el pedido</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-slate-200 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </label>

              <label class="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 cursor-pointer hover:border-primary transition-all group opacity-50">
                <div class="flex items-center gap-4">
                  <input type="radio" disabled class="w-5 h-5 text-primary focus:ring-primary" />
                  <div>
                    <span class="text-xs font-black uppercase tracking-widest">Webpay Plus (Próximamente)</span>
                    <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Tarjetas de Crédito y Débito</p>
                  </div>
                </div>
                <div class="text-[8px] font-black uppercase bg-slate-200 px-2 py-1 rounded">Deshabilitado</div>
              </label>
            </div>

            <button 
              @click="handleCheckout" 
              :disabled="loading"
              class="w-full btn-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span v-if="!loading">Confirmar y Pagar</span>
              <svg v-else class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </section>
        </div>

        <!-- Resumen -->
        <div class="space-y-8">
          <section class="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
            <h3 class="text-sm font-black uppercase tracking-widest border-b border-slate-50 pb-4">Tu Pedido</h3>
            <div class="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
              <div v-for="item in cart.items" :key="item.id" class="flex gap-4">
                <div class="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                  <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <div class="flex-grow space-y-1">
                  <h4 class="text-[10px] font-black uppercase tracking-tight leading-tight">{{ item.name }}</h4>
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] text-slate-400 font-bold">Cant: {{ item.quantity }}</span>
                    <span class="text-[10px] font-black text-dark">$ {{ (item.price * item.quantity).toLocaleString('es-CL') }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pt-6 border-t border-slate-50 space-y-4">
              <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>$ {{ cart.totalPrice.toLocaleString('es-CL') }}</span>
              </div>
              <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Envío</span>
                <span class="text-emerald-500">Gratis</span>
              </div>
              <div class="flex justify-between text-lg font-black text-dark tracking-tighter pt-2">
                <span>Total</span>
                <span class="text-primary">$ {{ cart.totalPrice.toLocaleString('es-CL') }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Éxito -->
      <div v-else class="max-w-2xl mx-auto text-center space-y-10 animate-fade-in py-20">
        <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="space-y-4">
          <h2 class="text-4xl lg:text-6xl font-black text-dark tracking-tighter uppercase leading-tight">¡Pedido <span class="text-primary">Recibido!</span></h2>
          <p class="text-lg text-slate-500 font-medium">Gracias por confiar en Corte Laser Metal. Hemos enviado los detalles a tu email.</p>
        </div>
        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left space-y-4">
          <div class="flex justify-between items-center border-b border-slate-50 pb-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Número de Pedido</span>
            <span class="text-sm font-black text-dark">#{{ orderSuccess?.id }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-50 pb-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pagado</span>
            <span class="text-sm font-black text-primary">$ {{ Number(orderSuccess?.total).toLocaleString('es-CL') }}</span>
          </div>
          <div class="pt-2">
            <p class="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Instrucciones: Por favor realiza la transferencia a la cuenta RUT 12.345.678-9 y envía el comprobante a ventas@cortelasermetal.cl</p>
          </div>
        </div>
        <router-link to="/tienda" class="inline-block btn-primary px-12 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20">
          Volver a la Tienda
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
