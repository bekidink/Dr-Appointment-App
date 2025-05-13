import { create } from 'zustand';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  token: number;
  
 
}

interface AuthStore {
  user: UserData | null;
  setUser: (data: UserData) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (data) => set({ user: data }),
}));
