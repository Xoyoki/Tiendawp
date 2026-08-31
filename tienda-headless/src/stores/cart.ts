import { defineStore } from 'pinia';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items') || '[]') as CartItem[],
    isOpen: false,
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
  },
  
  actions: {
    addItem(product: any) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          image: product.images[0]?.src || '',
          sku: product.sku || ''
        });
      }
      this.saveToLocal();
      this.isOpen = true; // Abrir carrito al añadir
    },
    
    removeItem(id: number) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveToLocal();
    },
    
    updateQuantity(id: number, quantity: number) {
      const item = this.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        this.saveToLocal();
      }
    },
    
    clearCart() {
      this.items = [];
      this.saveToLocal();
    },
    
    saveToLocal() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    },
    
    toggleCart() {
      this.isOpen = !this.isOpen;
    }
  }
});
