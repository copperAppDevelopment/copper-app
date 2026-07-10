import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  nombres: string | null;
  apellidos: string | null;
  cedula: string;
  tipo_documento: string;
  email: string | null;
  estado: boolean | null;
}

export interface ResidenteProfile {
  id: string;
  conjunto_id: string;
  apartamento_id: string | null;
  activo: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  session: any | null; // Objeto de sesión de Supabase Auth
  user: UserProfile | null;
  residente: ResidenteProfile | null;
  login: (session: any, user: UserProfile, residente: ResidenteProfile) => void;
  logout: () => void;
  updateApartamento: (apartamentoId: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      session: null,
      user: null,
      residente: null,
      login: (session, user, residente) =>
        set({
          isAuthenticated: true,
          session,
          user,
          residente,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          session: null,
          user: null,
          residente: null,
        }),
      updateApartamento: (apartamentoId) =>
        set((state) => ({
          residente: state.residente
            ? { ...state.residente, apartamento_id: apartamentoId }
            : null,
        })),
    }),
    {
      name: 'copper-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
