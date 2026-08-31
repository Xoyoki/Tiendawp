<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    auth.error = 'Las contraseñas no coinciden';
    return;
  }

  try {
    await auth.register({
      username: username.value,
      email: email.value,
      password: password.value
    });
    router.push('/dashboard');
  } catch (err) {
    console.error('Registration failed:', err);
  }
};
</script>

<template>
  <div class="min-h-[90vh] flex flex-col justify-center px-6 py-12">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black italic text-2xl mx-auto mb-6 shadow-xl shadow-primary/20">
        TL
      </div>
      <h2 class="text-3xl font-black text-dark tracking-tight">Crea tu cuenta</h2>
      <p class="mt-2 text-sm text-slate-500 font-medium">Únete a la precisión del corte láser</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-8 py-10 shadow-2xl shadow-slate-200/50 rounded-3xl border border-slate-100">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="username" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Nombre de Usuario</label>
            <input 
              v-model="username"
              id="username" 
              type="text" 
              required 
              class="block w-full px-4 py-4 rounded-xl border-0 bg-slate-50 text-dark shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
              placeholder="ej: juan_perez"
            />
          </div>

          <div>
            <label for="email" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Profesional</label>
            <input 
              v-model="email"
              id="email" 
              type="email" 
              required 
              class="block w-full px-4 py-4 rounded-xl border-0 bg-slate-50 text-dark shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
              placeholder="juan@empresa.cl"
            />
          </div>

          <div>
            <label for="password" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Contraseña</label>
            <input 
              v-model="password"
              id="password" 
              type="password" 
              required 
              class="block w-full px-4 py-4 rounded-xl border-0 bg-slate-50 text-dark shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Confirmar Contraseña</label>
            <input 
              v-model="confirmPassword"
              id="confirmPassword" 
              type="password" 
              required 
              class="block w-full px-4 py-4 rounded-xl border-0 bg-slate-50 text-dark shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <div v-if="auth.error" class="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">
            {{ auth.error }}
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="auth.loading"
              class="flex w-full justify-center rounded-xl bg-primary px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-primary/30 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50"
            >
              {{ auth.loading ? 'Creando cuenta...' : 'Registrarse Ahora' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-slate-500">
            ¿Ya tienes cuenta? 
            <router-link to="/login" class="text-primary font-black uppercase tracking-tighter hover:underline">Inicia Sesión</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
