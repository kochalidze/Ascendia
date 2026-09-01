import {create} from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const normalizeUser = (userData) => {
  if (!userData || typeof userData !== 'object') return null;

  const id = userData.id ?? userData._id ?? userData.userId ?? null;

  return {
    ...userData,
    id,
    _id: id,
    username: userData.username || userData.name || 'Guest',
    email: userData.email || '',
    role: userData.role || 'user',
    level: Number(userData.level ?? 0),
    xp: Number(userData.xp ?? 0),
    coins: Number(userData.coins ?? 0),
    avatar: userData.avatar || userData.avatar_url || '',
    bio: userData.bio || '',
    created_at: userData.created_at || null,
  };
};

export const useAuthStore = create((set) => ({
	user: null,  
	isAuthenticated: false,
	isLoading: true,
	error: null,

	register: async (username, email, password, bio) => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.post('/auth/register', { username, email, password, bio });
			const user = normalizeUser(response.data.user ?? response.data);
			set({ user, isAuthenticated: Boolean(user) });
		} catch (error) {
			set({ error: error.response?.data?.message || 'Registration failed' });
		} finally {
			set({ isLoading: false });
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.post('/auth/login', { email, password });
			const user = normalizeUser(response.data.user ?? response.data);
			set({ user, isAuthenticated: Boolean(user) });
		} catch (error) {
			set({ error: error.response?.data?.message || 'Login failed' });
			throw error; 
		} finally {
			set({ isLoading: false });
		}
	},

	checkAuth: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.get('/auth/me');
			const user = normalizeUser(response.data.user ?? response.data);
			set({ user, isAuthenticated: Boolean(user) });
		} catch (error) {
			set({ user: null, isAuthenticated: false, error: null });
			console.log('Login error:', error.response?.data || error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	clearError: () => set({ error: null }),
}));