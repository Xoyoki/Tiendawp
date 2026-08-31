import { defineStore } from 'pinia';
import { login as apiLogin, register as apiRegister } from '../api/wordpress';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('user_token') || null,
    user: JSON.parse(localStorage.getItem('user_data') || 'null'),
    loading: false,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials: any) {
      this.loading = true;
      this.error = null;
      try {
        const data = await apiLogin(credentials);
        this.token = data.token;
        this.user = {
          email: data.user_email,
          nicename: data.user_nicename,
          displayName: data.user_display_name
        };
        localStorage.setItem('user_token', this.token as string);
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error al iniciar sesión';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async register(userData: any) {
      this.loading = true;
      this.error = null;
      try {
        await apiRegister(userData);
        // Después de registrar, iniciamos sesión automáticamente
        return await this.login({ 
          username: userData.username, 
          password: userData.password 
        });
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error al registrar usuario';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.error = null;
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
    },
  },
});
