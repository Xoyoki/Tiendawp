<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const router = useRouter();

const goToCheckout = () => {
  cart.isOpen = false;
  router.push('/checkout');
};
</script>

<template>
  <div>
    <!-- Backdrop -->
    <transition name="fade">
      <div 
        v-if="cart.isOpen" 
        @click="cart.toggleCart"
        class="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[60]"
      ></div>
    </transition>

    <!-- Drawer -->
    <transition name="slide">
      <div 
        v-if="cart.isOpen"
        class="fixed top-0 right-0 w-full max-w-md h-full bg-white z-[70] shadow-2xl flex flex-col"
      >
        <!-- Header -->
        <div class="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tighter italic">Tu <span class="text-primary">Carrito</span></h2>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{{ cart.totalItems }} productos añadidos</p>
          </div>
          <button @click="cart.toggleCart" class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-dark transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
          <div v-if="cart.items.length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-[10px] font-black uppercase tracking-widest">El carrito está vacío</p>
          </div>

          <div 
            v-for="item in cart.items" 
            :key="item.id"
            class="flex gap-4 group"
          >
            <div class="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
              <img :src="item.image" class="w-full h-full object-cover" />
            </div>
            
            <div class="flex-grow space-y-1">
              <div class="flex justify-between items-start">
                <h3 class="text-xs font-black uppercase tracking-tight leading-tight max-w-[150px]">{{ item.name }}</h3>
                <button @click="cart.removeItem(item.id)" class="text-slate-300 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SKU: {{ item.sku }}</div>
              <div class="flex items-center justify-between pt-2">
                <div class="flex items-center bg-slate-50 rounded-lg p-0.5">
                  <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="w-6 h-6 flex items-center justify-center text-[10px] font-black">-</button>
                  <span class="w-6 text-center text-[10px] font-black">{{ item.quantity }}</span>
                  <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="w-6 h-6 flex items-center justify-center text-[10px] font-black">+</button>
                </div>
                <div class="text-xs font-black text-primary">$ {{ (item.price * item.quantity).toLocaleString('es-CL') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cart.items.length > 0" class="p-8 border-t border-slate-50 space-y-6 bg-slate-50/50">
          <div class="flex justify-between items-end">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total a pagar</span>
            <span class="text-2xl font-black text-dark tracking-tighter">$ {{ cart.totalPrice.toLocaleString('es-CL') }}</span>
          </div>
          
          <button 
            @click="goToCheckout"
            class="w-full btn-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
          >
            Finalizar Compra
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7-7 7" />
            </svg>
          </button>
          
          <p class="text-[8px] font-bold text-center text-slate-400 uppercase tracking-widest">Impuestos y enví­o calculados en el checkout</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@reference "../style.css";

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
