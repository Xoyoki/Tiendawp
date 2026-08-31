<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const sending = ref(false);
const sent = ref(false);

const handleSubmit = async () => {
  sending.value = true;
  // Simulación de envío
  await new Promise(resolve => setTimeout(resolve, 1500));
  sending.value = false;
  sent.value = true;
  form.value = { name: '', email: '', subject: '', message: '' };
  
  setTimeout(() => {
    sent.value = false;
  }, 5000);
};
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <section class="px-6 py-20 lg:py-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
      <div class="max-w-7xl mx-auto relative z-10">
        <h1 class="text-5xl lg:text-8xl font-black text-dark tracking-tighter uppercase mb-6 leading-[0.9]">
          Hablemos de tu <span class="text-primary">Proyecto</span>
        </h1>
        <p class="text-lg text-slate-500 font-medium max-w-xl">
          ¿Tienes una idea en mente? Nuestro equipo de expertos está listo para transformar tus diseños en realidad con precisión láser.
        </p>
      </div>
      <!-- Background Decor -->
      <div class="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
    </section>

    <!-- Content -->
    <section class="px-6 py-20 lg:py-32">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        <!-- Form -->
        <div class="space-y-12">
          <div class="space-y-4">
            <h2 class="text-3xl font-black uppercase tracking-tighter">Envíanos un mensaje</h2>
            <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Responderemos en menos de 24 horas</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nombre Completo</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  required
                  class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  required
                  class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="juan@ejemplo.com"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Asunto</label>
              <input 
                v-model="form.subject"
                type="text" 
                required
                class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Ej. Cotización Corte Láser"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mensaje</label>
              <textarea 
                v-model="form.message"
                required
                rows="6"
                class="w-full bg-slate-50 border-0 rounded-3xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                placeholder="Cuéntanos sobre tu proyecto..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              :disabled="sending"
              class="w-full btn-primary py-5 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span v-if="!sending">Enviar Mensaje</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            </button>

            <p v-if="sent" class="text-center text-emerald-500 font-black text-xs uppercase tracking-widest animate-bounce">
              ¡Mensaje enviado con éxito! Nos contactaremos pronto.
            </p>
          </form>
        </div>

        <!-- Info -->
        <div class="lg:pl-20 space-y-20">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12">
            <div class="space-y-4">
              <h3 class="text-xs font-black uppercase tracking-[0.3em] text-primary">Ubicación</h3>
              <p class="text-slate-900 font-bold leading-relaxed">
                Av. Industrial 1234<br/>
                Santiago, Chile
              </p>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-xs font-black uppercase tracking-[0.3em] text-primary">Contacto Directo</h3>
              <div class="space-y-2">
                <p class="text-slate-900 font-bold">ventas@cortelasermetal.cl</p>
                <p class="text-slate-900 font-bold">+56 9 1234 5678</p>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-xs font-black uppercase tracking-[0.3em] text-primary">Horario</h3>
              <p class="text-slate-900 font-bold leading-relaxed">
                Lunes a Viernes<br/>
                09:00 - 18:00 hrs
              </p>
            </div>
          </div>

          <!-- Social -->
          <div class="pt-10 border-t border-slate-100 flex gap-8">
            <a href="#" class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
              <span class="text-[10px] font-black uppercase tracking-widest">IG</span>
            </a>
            <a href="#" class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
              <span class="text-[10px] font-black uppercase tracking-widest">FB</span>
            </a>
            <a href="#" class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
              <span class="text-[10px] font-black uppercase tracking-widest">LK</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "../style.css";
</style>
