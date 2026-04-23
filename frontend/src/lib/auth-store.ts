import { create } from 'zustand';
import { adminApi } from './api';

interface User {
  _id: string;
  email: string;
  nameEn: string;
  nameAr: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  login: async (email, password) => {
    const res = await adminApi.login(email, password);
    const { user, accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, refreshToken, isLoading: false });
    return user;
  },

  logout: async () => {
    const { accessToken, refreshToken } = get();
    try {
      if (accessToken) {
        await adminApi.logout(accessToken, refreshToken || undefined);
      }
    } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
  },


      .catch(() => {
        if (refreshToken) {
          get().refreshAuth();
        } else {
          set({ isLoading: false });
        }
      });
  },
}));
