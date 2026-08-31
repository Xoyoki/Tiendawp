<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { getProductCategories, createProduct, createProductCategory, getProducts, uploadMedia, deleteMedia } from '../api/wordpress';

const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadedMediaIds = ref<number[]>([]);
const isFormSaved = ref(false);

// Buscador de Categorías
const searchCategoryQuery = ref('');
const isCategoryDropdownOpen = ref(false);
const categorySearchInput = ref<HTMLInputElement | null>(null);

const filteredCategories = computed(() => {
  if (!searchCategoryQuery.value) return categories.value;
  const query = searchCategoryQuery.value.toLowerCase();
  return categories.value.filter(cat => 
    cat.name.toLowerCase().includes(query)
  );
});

const selectCategory = (cat: any) => {
  selectedCategoryId.value = cat.id;
  searchCategoryQuery.value = cat.name;
  isCategoryDropdownOpen.value = false;
};

const handleCategoryBlur = () => {
  // Pequeño delay para permitir el click en la opción
  setTimeout(() => {
    isCategoryDropdownOpen.value = false;
    // Si el query no coincide con la categoría seleccionada, resetear o buscar coincidencia exacta
    const exactMatch = categories.value.find(c => c.name.toLowerCase() === searchCategoryQuery.value.toLowerCase());
    if (exactMatch) {
      selectedCategoryId.value = exactMatch.id;
      searchCategoryQuery.value = exactMatch.name;
    } else if (!selectedCategoryId.value) {
      searchCategoryQuery.value = '';
    }
  }, 200);
};

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'gif';
  content: string;
}

interface ProductForm {
  name: string;
  sku: string;
  type: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  stock_status: string;
  manage_stock: boolean;
  stock_quantity: number;
  categories: any[];
  images: any[];
  meta_data: Array<{ key: string; value: string }>;
}

const form = ref<ProductForm>({
  name: '',
  sku: '',
  type: 'simple',
  regular_price: '',
  sale_price: '',
  description: '',
  short_description: '',
  stock_status: 'instock',
  manage_stock: true,
  stock_quantity: 0,
  categories: [],
  images: [],
  meta_data: [
    { key: '_content_blocks', value: '[]' }
  ]
});

const contentBlocks = ref<ContentBlock[]>([]);
const categories = ref<any[]>([]);
const selectedCategoryId = ref<number | string>('');
const loadingCategories = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

// Modal Categoría
const showCategoryModal = ref(false);
const newCategoryName = ref('');
const creatingCategory = ref(false);

onMounted(async () => {
  try {
    const [catsResponse, productsResponse] = await Promise.all([
      getProductCategories(),
      getProducts({ per_page: 100, orderby: 'id', order: 'desc' }) // Aumentamos per_page para encontrar el SKU real
    ]);
    
    // VALIDACIÓN: Asegurar que categories sea un array
    categories.value = (catsResponse && Array.isArray(catsResponse.data)) ? catsResponse.data : [];
    console.log('📁 Categorías cargadas:', categories.value);
    
    // VALIDACIÓN: Asegurar que products sea un array
    const products = (productsResponse && Array.isArray(productsResponse.data)) ? productsResponse.data : [];
    
    // SKU Progresivo
    if (products.length > 0) {
      // Intentar encontrar el SKU más alto
      const skus = products.map((p: any) => {
        const num = parseInt(p.sku?.replace(/\D/g, '') || '0');
        return isNaN(num) ? 0 : num;
      });
      const maxSku = Math.max(...skus, 0);
      form.value.sku = `CL-PROD-${String(maxSku + 1).padStart(4, '0')}`;
    } else {
      form.value.sku = 'CL-PROD-0001';
    }

  } catch (err) {
    console.error('Error loading initial data:', err);
  } finally {
    loadingCategories.value = false;
  }
});

// Advertencia de cambios no guardados y limpieza de imágenes
const cleanupMedia = async () => {
  if (uploadedMediaIds.value.length > 0) {
    console.log('🧹 Limpiando imágenes subidas no guardadas...');
    await Promise.all(uploadedMediaIds.value.map(id => deleteMedia(id)));
    uploadedMediaIds.value = [];
  }
};

onBeforeRouteLeave(async (to, from, next) => {
  if (isFormSaved.value || (form.value.name === '' && form.value.images.length === 0 && contentBlocks.value.length === 0)) {
    next();
    return;
  }

  const confirmLeave = window.confirm('Tienes cambios sin guardar. Si sales ahora, se eliminarán las imágenes subidas. ¿Estás seguro de que quieres salir?');
  
  if (confirmLeave) {
    await cleanupMedia();
    next();
  } else {
    next(false);
  }
});

// Manejar cierre de pestaña/navegador
const handleUnload = (e: BeforeUnloadEvent) => {
  if (!isFormSaved.value && (form.value.name !== '' || form.value.images.length > 0)) {
    e.preventDefault();
    e.returnValue = '';
  }
};

window.addEventListener('beforeunload', handleUnload);
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleUnload);
});

const addCategory = async () => {
  if (!newCategoryName.value) return;
  
  // VALIDACIÓN: Comprobar si la categoría ya existe localmente antes de enviar
  const exists = categories.value.some(cat => 
    cat.name.toLowerCase() === newCategoryName.value.toLowerCase()
  );
  
  if (exists) {
    alert(`La categoría "${newCategoryName.value}" ya existe en la base de datos.`);
    return;
  }

  creatingCategory.value = true;
  error.value = null;
  try {
    const newCat = await createProductCategory({ name: newCategoryName.value });
    // Refrescar lista de categorías para asegurar sincronía con el ID real
    const allCatsResponse = await getProductCategories();
    categories.value = (allCatsResponse && Array.isArray(allCatsResponse.data)) ? allCatsResponse.data : [];
    selectedCategoryId.value = newCat.id;
    searchCategoryQuery.value = newCat.name; // Actualizar el buscador con el nombre nuevo
    showCategoryModal.value = false;
    newCategoryName.value = '';
  } catch (err: any) {
    console.error('Error al crear categoría:', err);
    alert(err.response?.data?.message || 'Error al crear la categoría. Es posible que ya exista.');
  } finally {
    creatingCategory.value = false;
  }
};

const addBlock = (type: ContentBlock['type']) => {
  contentBlocks.value.push({
    id: Date.now().toString(),
    type,
    content: ''
  });
};

const removeBlock = (index: number) => {
  contentBlocks.value.splice(index, 1);
};

const triggerImageUpload = () => {
  fileInput.value?.click();
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const files = Array.from(input.files);
  isUploading.value = true;
  error.value = null;

  try {
    const uploadPromises = files.map(file => uploadMedia(file));
    const results = await Promise.all(uploadPromises);
    console.log('✅ Imágenes subidas con éxito:', results);
    
    // Guardar IDs para limpieza si no se guarda el producto
    results.forEach(media => {
      if (media.id) uploadedMediaIds.value.push(media.id);
    });

    // Añadimos las nuevas imágenes al array existente
    const newImages = results.map(media => ({ 
      src: media.source_url || media.guid?.rendered || '' 
    }));
    form.value.images = [...form.value.images, ...newImages];
    
    success.value = true;
    setTimeout(() => success.value = false, 3000);
  } catch (err: any) {
    console.error('Error al subir imágenes:', err);
    if (err.response?.status === 401) {
      error.value = 'Error de Autorización (401). Asegúrate de que WP_USER y WP_APP_PASSWORD estén configurados correctamente en el servidor del host.';
    } else {
      error.value = 'Error al subir las imágenes al servidor. Verifica la conexión y el tamaño de los archivos.';
    }
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

const handleBlockFileUpload = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const block = contentBlocks.value[index];
  
  try {
    // Reutilizamos la lógica de carga para bloques
    const media = await uploadMedia(file);
    if (media.id) uploadedMediaIds.value.push(media.id);
    block.content = media.source_url;
  } catch (err) {
    console.error('Error al subir archivo de bloque:', err);
    alert('Error al subir el archivo');
  } finally {
    if (input) input.value = '';
  }
};

const handleCancel = async () => {
  const confirmCancel = window.confirm('¿Estás seguro de que quieres cancelar? Se perderá todo el progreso y se eliminarán las imágenes subidas.');
  if (confirmCancel) {
    await cleanupMedia();
    isFormSaved.value = true; // Para evitar la alerta doble al navegar
    router.push('/dashboard/productos');
  }
};

const handleSubmit = async () => {
  if (!form.value.name || !form.value.regular_price) {
    error.value = 'El nombre y el precio son obligatorios';
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    // Generar descripción HTML combinando bloques
    let fullDescription = form.value.description;
    if (contentBlocks.value.length > 0) {
      fullDescription += '<div class="product-content-blocks">';
      contentBlocks.value.forEach(block => {
        if (block.type === 'text') {
          fullDescription += `<div class="block-text">${block.content}</div>`;
        } else if (block.type === 'image' || block.type === 'gif') {
          fullDescription += `<img src="${block.content}" class="block-media" />`;
        } else if (block.type === 'video') {
          fullDescription += `<video src="${block.content}" controls class="block-media"></video>`;
        }
      });
      fullDescription += '</div>';
    }

    const productData = {
      ...form.value,
      description: fullDescription,
      categories: selectedCategoryId.value ? [{ id: Number(selectedCategoryId.value) }] : [],
      meta_data: [
        { key: '_content_blocks', value: JSON.stringify(contentBlocks.value) }
      ]
    };
    
    await createProduct(productData);
    isFormSaved.value = true; // Marcar como guardado para evitar la alerta
    success.value = true;
    
    setTimeout(() => {
      router.push('/dashboard/productos');
    }, 2000);
  } catch (err: any) {
    console.error('Error al guardar producto:', err);
    error.value = err.response?.data?.message || 'Error al conectar con el servidor';
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto pb-20 relative">
    <!-- Modal Categoría -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-fade-in">
        <h3 class="text-xl font-black uppercase tracking-tighter italic mb-6">Nueva <span class="text-primary">Categoría</span></h3>
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre de la Categoría</label>
            <input 
              v-model="newCategoryName"
              type="text" 
              class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Ej. Mobiliario Industrial"
              @keyup.enter="addCategory"
            />
          </div>
          <div class="flex gap-4">
            <button @click="showCategoryModal = false" class="flex-grow px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50">
              Cancelar
            </button>
            <button 
              @click="addCategory"
              :disabled="creatingCategory || !newCategoryName"
              class="flex-grow px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {{ creatingCategory ? 'Creando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Gestión de Inventario</h4>
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Agregar Nuevo <span class="text-primary">Producto</span></h1>
      </div>
      <div class="flex gap-4">
        <button 
          @click="handleCancel" 
          class="px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button 
          @click="handleSubmit"
          :disabled="saving"
          class="px-10 py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {{ saving ? 'Guardando...' : 'Publicar Producto' }}
        </button>
      </div>
    </header>

    <!-- Alertas -->
    <div v-if="error" class="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>

    <div v-if="success" class="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Producto creado con éxito. Redirigiendo...
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <!-- Información General -->
        <section class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Información General</h3>
          
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre del Producto</label>
            <input 
              v-model="form.name"
              type="text" 
              class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Ej. Panel Decorativo Hexagonal"
            />
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">SKU (Automático)</label>
              <div class="relative">
                <input 
                  v-model="form.sku"
                  type="text" 
                  readonly
                  class="w-full bg-slate-100 border-0 rounded-2xl px-6 py-4 text-sm font-mono ring-1 ring-slate-200 text-slate-500 cursor-not-allowed outline-none transition-all"
                  placeholder="CL-PROD-0001"
                />
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoría</label>
              <div class="flex gap-2">
                <div class="flex-grow relative group">
                  <input 
                    ref="categorySearchInput"
                    v-model="searchCategoryQuery"
                    type="text"
                    class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900"
                    placeholder="Buscar o seleccionar..."
                    @focus="isCategoryDropdownOpen = true"
                    @blur="handleCategoryBlur"
                  />
                  
                  <!-- Dropdown de Resultados -->
                  <div 
                    v-if="isCategoryDropdownOpen" 
                    class="absolute z-50 w-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl max-h-60 overflow-y-auto no-scrollbar animate-fade-in"
                  >
                    <div v-if="filteredCategories.length === 0" class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 text-center">
                      No se encontraron categorías
                    </div>
                    <button
                      v-for="cat in filteredCategories"
                      :key="cat.id"
                      type="button"
                      @mousedown="selectCategory(cat)"
                      class="w-full text-left px-6 py-4 text-sm text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <span>{{ cat.name }}</span>
                      <svg v-if="selectedCategoryId === cat.id" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>

                  <!-- Icono de flecha/lupa -->
                  <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="showCategoryModal = true" 
                  class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 hover:bg-white hover:shadow-lg hover:scale-105 transition-all active:scale-95 group"
                  title="Nueva Categoría"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <!-- Mensaje si no hay categorías -->
              <p v-if="categories.length === 0 && !loadingCategories" class="text-[9px] font-bold text-orange-400 ml-1 uppercase tracking-tighter">
                No se encontraron categorías en la base de datos.
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descripción Corta</label>
            <textarea 
              v-model="form.short_description"
              rows="3"
              class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              placeholder="Breve resumen del producto..."
            ></textarea>
          </div>
        </section>

        <!-- Bloques de Contenido Infinitos -->
        <section class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div class="flex items-center justify-between border-b border-slate-50 pb-4">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Descripción Detallada (Bloques)</h3>
            <div class="flex gap-2">
              <button @click="addBlock('text')" class="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Texto">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <button @click="addBlock('image')" class="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Imagen">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button @click="addBlock('video')" class="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Video">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button @click="addBlock('gif')" class="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors" title="GIF">
                <span class="text-[8px] font-black">GIF</span>
              </button>
            </div>
          </div>

          <div v-if="contentBlocks.length === 0" class="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-300">No hay bloques añadidos</p>
          </div>

          <div class="space-y-6">
            <div v-for="(block, index) in contentBlocks" :key="block.id" class="relative bg-slate-50 p-6 rounded-3xl border border-slate-100 group animate-fade-in">
              <button @click="removeBlock(index)" class="absolute -top-2 -right-2 w-8 h-8 bg-white text-slate-300 hover:text-red-500 rounded-full shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-[8px] font-black uppercase tracking-widest text-primary px-2 py-1 bg-white rounded-md border border-slate-100">{{ block.type }}</span>
                </div>

                <textarea 
                  v-if="block.type === 'text'"
                  v-model="block.content"
                  rows="4"
                  class="w-full bg-white border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Escribe el contenido aquí..."
                ></textarea>

                <div v-else class="space-y-4">
                  <div class="flex gap-2">
                    <input 
                      v-model="block.content"
                      type="text"
                      class="flex-grow bg-white border-0 rounded-2xl px-6 py-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                      :placeholder="block.type === 'video' ? 'URL del Video' : 'URL de la Imagen / GIF'"
                    />
                    <label class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer shadow-sm">
                      <input type="file" class="hidden" @change="handleBlockFileUpload($event, index)" :accept="block.type === 'video' ? 'video/*' : 'image/*'" />
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </label>
                  </div>
                  <div v-if="block.content" class="rounded-2xl overflow-hidden border border-slate-100 bg-white p-2">
                    <img v-if="block.type !== 'video'" :src="block.content" class="w-full h-32 object-contain rounded-xl" />
                    <video v-else :src="block.content" class="w-full h-32 object-contain rounded-xl" controls></video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Precios y Stock -->
        <section class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Precios y Stock</h3>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Precio Normal ($)</label>
              <input 
                v-model="form.regular_price"
                type="number" 
                class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Precio Rebajado ($)</label>
              <input 
                v-model="form.sale_price"
                type="number" 
                class="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-black text-primary ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="flex items-center gap-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div class="flex items-center gap-3">
              <input 
                type="checkbox" 
                v-model="form.manage_stock"
                class="w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary"
              />
              <span class="text-xs font-black uppercase tracking-widest text-slate-700">Gestionar Inventario</span>
            </div>
            
            <div v-if="form.manage_stock" class="flex-grow flex items-center gap-4">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Cantidad:</label>
              <input 
                v-model="form.stock_quantity"
                type="number" 
                class="w-24 bg-white border-0 rounded-xl px-4 py-2 text-sm font-black ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Columna Lateral -->
      <div class="space-y-8">
        <!-- Imágenes -->
        <section class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Imágenes</h3>
          
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*"
            multiple
            @change="handleImageUpload"
          />

          <div 
            @click="triggerImageUpload"
            class="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center group hover:border-primary transition-colors cursor-pointer relative overflow-hidden"
          >
            <template v-if="isUploading">
              <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Subiendo...</span>
            </template>
            <template v-else>
              <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Añadir Imágenes</span>
              <p class="text-[8px] font-bold text-slate-300 mt-2 uppercase">Puedes seleccionar varias</p>
            </template>
          </div>

          <div v-if="form.images.length > 0" class="grid grid-cols-3 gap-3 mt-4">
            <div v-for="(img, idx) in form.images" :key="idx" class="relative aspect-square bg-white rounded-2xl border-2 border-primary/20 overflow-hidden group shadow-sm">
              <img 
                :src="img.src" 
                class="w-full h-full object-cover" 
                @error="(e: any) => e.target.src = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=broken+image+placeholder+icon+minimalist+gray&image_size=square'"
              />
              <div class="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button @click.stop="removeImage(idx)" class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Estado -->
        <section class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Estado</h3>
          
          <div class="space-y-3">
            <button 
              @click="form.stock_status = 'instock'"
              :class="form.stock_status === 'instock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'"
              class="w-full flex items-center justify-between px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all"
            >
              En Stock
              <div class="w-2 h-2 rounded-full bg-current"></div>
            </button>
            <button 
              @click="form.stock_status = 'outofstock'"
              :class="form.stock_status === 'outofstock' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'"
              class="w-full flex items-center justify-between px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Sin Stock
              <div class="w-2 h-2 rounded-full bg-current"></div>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
