<script setup lang="ts">
// Vista de Nosotros
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="px-6 py-24 lg:py-40 bg-dark text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto relative z-10">
        <h4 class="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8">Nuestra Historia</h4>
        <h1 class="text-5xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-12">
          Pasión por la <br/>
          <span class="text-primary italic">Precisión</span>
        </h1>
        <p class="text-lg lg:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
          Desde 2015, transformamos el metal en soluciones industriales y piezas de arte con la tecnología láser más avanzada de Chile.
        </p>
      </div>
      
      <!-- Decoración -->
      <div class="absolute right-[-10%] top-[-10%] w-[60%] h-[120%] bg-primary/10 rounded-full blur-[150px]"></div>
      <div class="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>

    <!-- Stats -->
    <section class="px-6 py-20 bg-white">
      <div class="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
        <div class="text-center space-y-2">
          <div class="text-4xl lg:text-6xl font-black text-dark tracking-tighter">+8</div>
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">Años de Experiencia</div>
        </div>
        <div class="text-center space-y-2">
          <div class="text-4xl lg:text-6xl font-black text-dark tracking-tighter">+500</div>
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">Proyectos Anuales</div>
        </div>
        <div class="text-center space-y-2">
          <div class="text-4xl lg:text-6xl font-black text-dark tracking-tighter">0.1mm</div>
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">Margen de Precisión</div>
        </div>
        <div class="text-center space-y-2">
          <div class="text-4xl lg:text-6xl font-black text-dark tracking-tighter">100%</div>
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">Compromiso Local</div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="px-6 py-32 border-t border-slate-50">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div class="relative group">
          <div class="aspect-square bg-slate-100 rounded-[4rem] overflow-hidden">
            <img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern+laser+cutting+factory+facility+clean+industrial+interior+chile&image_size=square_hd" 
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
            />
          </div>
          <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-primary rounded-full flex items-center justify-center p-8 text-white font-black text-center text-[10px] uppercase tracking-widest leading-tight rotate-12 shadow-2xl shadow-primary/40">
            Tecnología de Vanguardia
          </div>
        </div>

        <div class="space-y-10">
          <h2 class="text-4xl font-black uppercase tracking-tighter leading-tight">
            Nuestra Misión es elevar el estándar de la <span class="text-primary">manufactura nacional</span>.
          </h2>
          <div class="space-y-6 text-slate-500 font-medium leading-relaxed">
            <p>
              En Corte Laser Metal, no solo cortamos metal; materializamos ideas. Nuestra planta está equipada con tecnología de fibra óptica de última generación, permitiéndonos trabajar con una amplia gama de materiales con una rapidez y exactitud inigualables.
            </p>
            <p>
              Creemos en la colaboración estrecha con nuestros clientes, desde el diseño inicial hasta el producto final, asegurando que cada pieza cumpla con las especificaciones técnicas más exigentes del mercado.
            </p>
          </div>
          
          <div class="pt-8">
            <router-link to="/contacto" class="btn-primary px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20">
              Trabaja con Nosotros
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="px-6 py-32 bg-slate-50">
      <div class="max-w-7xl mx-auto space-y-20">
        <div class="text-center max-w-2xl mx-auto space-y-4">
          <h2 class="text-3xl font-black uppercase tracking-tighter">Valores que nos definen</h2>
          <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Los pilares de nuestra operación diaria</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group">
            <div class="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-black uppercase tracking-tighter mb-4">Calidad Certificada</h3>
            <p class="text-slate-400 text-sm font-medium leading-relaxed">Rigurosos procesos de control de calidad en cada etapa de producción.</p>
          </div>

          <div class="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group">
            <div class="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-black uppercase tracking-tighter mb-4">Rapidez y Agilidad</h3>
            <p class="text-slate-400 text-sm font-medium leading-relaxed">Tiempos de entrega optimizados sin comprometer la precisión del resultado.</p>
          </div>

          <div class="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group">
            <div class="w-16 h-16 bg-dark/5 rounded-2xl flex items-center justify-center text-dark mb-8 group-hover:bg-dark group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 class="text-xl font-black uppercase tracking-tighter mb-4">Diseño Innovador</h3>
            <p class="text-slate-400 text-sm font-medium leading-relaxed">Equipo creativo capaz de resolver desafíos técnicos y estéticos complejos.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "../style.css";
</style>
