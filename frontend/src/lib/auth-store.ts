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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,

  login: async (email, password) => {
    const res = await adminApi.login(email, password);
    const { user, accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, refreshToken, isLoading: false });
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

  refreshAuth: async () => {
    const rt = get().refreshToken || localStorage.getItem('refreshToken');
    if (!rt) return false;
    try {
      const res = await adminApi.refresh(rt);
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const userRes = await adminApi.getMe(accessToken);
      set({ user: userRes.data, accessToken, refreshToken, isLoading: false });
      return true;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
      return false;
    }
  },

  initAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) {
      set({ isLoading: false });
      return;
    }

    set({ accessToken, refreshToken });

    adminApi
      .getMe(accessToken)
      .then((res) => {
        set({ user: res.data, isLoading: false });
      })
      .catch(() => {
        if (refreshToken) {
          get().refreshAuth();
        } else {
          set({ isLoading: false });
        }
      });
  },
}));
