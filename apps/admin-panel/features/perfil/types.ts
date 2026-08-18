/** Fila de `public.users` con los campos que muestra y edita la pestaña de perfil. */
export interface Perfil {
  id: string;
  nombres: string | null;
  apellidos: string | null;
  email: string | null;
  tipo_documento: string | null;
  documento: string | null;
  phone_number: string | null;
  direccion: string | null;
  foto_url: string | null;
  rol: string | null;
  created_at: string | null;
}

export interface DatosPerfil {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  documento: string;
  phone_number: string;
  direccion: string;
}

export const TIPOS_DOCUMENTO = [
  { value: "CC", label: "Cédula de Ciudadanía (CC)" },
  { value: "CE", label: "Cédula de Extranjería (CE)" },
  { value: "NIT", label: "NIT" },
  { value: "PAS", label: "Pasaporte" },
];

export const TABS = [
  { id: "perfil", label: "Perfil" },
  { id: "conjuntos", label: "Mis conjuntos" },
  { id: "equipo", label: "Equipo" },
  { id: "administracion", label: "Configuración de administración" },
  { id: "areas", label: "Áreas comunes" },
] as const;

export type TabPerfil = (typeof TABS)[number]["id"];

export const esTab = (valor: string): valor is TabPerfil =>
  TABS.some(t => t.id === valor);
