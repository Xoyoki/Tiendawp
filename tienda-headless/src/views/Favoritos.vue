<template>
  <div class="min-h-screen bg-white px-6 py-20 flex flex-col items-center justify-center text-center">
    <div class="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
    <h1 class="text-3xl font-black text-dark tracking-tighter uppercase mb-4">Tus Favoritos</h1>
    <p class="text-slate-500 max-w-xs font-medium">Aún no tienes productos guardados. ¡Explora la tienda y dales amor!</p>
    <router-link to="/tienda" class="btn-primary mt-10 px-8 rounded-xl">Ir a la Tienda</router-link>
  </div>
</template>
