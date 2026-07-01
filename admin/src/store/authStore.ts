import { create } from "zustand";
import axios from "axios";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: AdminUser | null;
  accessToken: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isInitialized: false,
  isAuthenticated: false,

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  initAuth: async () => {
    try {
      const response = await axios.get("http://localhost:5510/api/auth/refresh", {
        withCredentials: true,
      });
      const { user, accessToken } = response.data;
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },

  login: async (email: string, password: string) => {
    const response = await axios.post(
      "http://localhost:5510/api/auth/login",
      { email, password },
      { withCredentials: true }
    );
    const { user, accessToken } = response.data;
    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await axios.post(
        "http://localhost:5510/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },
}));
