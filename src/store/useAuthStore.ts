import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  setLoggedIn: (v: boolean) => void;
  setAuthLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthLoading: true,
  setLoggedIn: (v) => set({ isLoggedIn: v }),
  setAuthLoading: (v) => set({ isAuthLoading: v }),
}));