import { create } from 'zustand';
import { User } from '@/types/music';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

interface AuthStore extends AuthState, AuthActions {}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  ...initialState,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const user = await response.json();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const user = await response.json();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const user = await response.json();
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));