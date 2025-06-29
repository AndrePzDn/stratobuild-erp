import { logoutUser } from "@/utils/connections";
import { create } from "zustand";

interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  login: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    const token = get().user?.token;
    if (token) {
      logoutUser(token);
    }
    set({ user: null });
  },
  isAuthenticated: () => !!get().user,
}));
