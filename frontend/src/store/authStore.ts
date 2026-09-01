import { create } from 'zustand';
import { authClient } from '../lib/auth-client';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  coins: number;
  avatar: string;
  bio: string;
  created_at: string | null;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
};

const normalizeUser = (userData: any): User | null => {
  if (!userData || typeof userData !== 'object') return null;

  return {
    id: userData.id,
    username: userData.username || userData.name || 'Guest',
    email: userData.email || '',
    role: userData.role || 'user',
    level: Number(userData.level ?? 0),
    xp: Number(userData.xp ?? 0),
    coins: Number(userData.coins ?? 0),
    avatar: userData.avatar || userData.image || '',
    bio: userData.bio || '',
    created_at: userData.createdAt || null,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: username,
      });
      if (error) throw new Error(error.message);
      const user = normalizeUser(data?.user);
      set({ user, isAuthenticated: Boolean(user) });
    } catch (err: any) {
      set({ error: err.message || 'Registration failed' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) throw new Error(error.message);
      const user = normalizeUser(data?.user);
      set({ user, isAuthenticated: Boolean(user) });
    } catch (err: any) {
      set({ error: err.message || 'Login failed' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authClient.signOut();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authClient.getSession();
      const user = normalizeUser(data?.user);
      set({ user, isAuthenticated: Boolean(user) });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));