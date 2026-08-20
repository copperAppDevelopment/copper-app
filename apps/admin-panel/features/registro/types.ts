/** Los pasos del asistente, en orden. */
export type PasoRegistro = "cuenta" | "conjunto" | "plan" | "listo";

export const PASOS: { clave: PasoRegistro; titulo: string; descripcion: string }[] = [
  { clave: "cuenta", titulo: "Tu cuenta", descripcion: "Datos de quien administra" },
  { clave: "conjunto", titulo: "Tu conjunto", descripcion: "Dirección, ciudad y torres" },
  { clave: "plan", titulo: "Plan y pago", descripcion: "Elige y paga la suscripción" },
];

/** Lo que pide el formulario de la cuenta. Espejo de lo que exige `users`. */
export interface DatosRegistro {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  documento: string;
  telefono: string;
  email: string;
  contrasena: string;
  confirmacion: string;
  /** Trampa para bots: si viene con algo, el servidor descarta la petición. */
  website: string;
}

export const REGISTRO_VACIO: DatosRegistro = {
  nombres: "",
  apellidos: "",
  tipo_documento: "CC",
  documento: "",
  telefono: "",
  email: "",
  contrasena: "",
  confirmacion: "",
  website: "",
};

/** Los que acepta `users.tipo_documento`, que es texto libre pero solo usa estos. */
export const TIPOS_DOCUMENTO = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PAS", label: "Pasaporte" },
];

export const MIN_PASSWORD = 8;

/** El primer motivo por el que el formulario no se puede enviar, o `null`. */
export function motivoInvalido(datos: DatosRegistro): string | null {
  if (!datos.nombres.trim() || !datos.apellidos.trim()) return "Escribe tu nombre y tus apellidos";
  if (!datos.documento.trim()) return "Escribe tu número de documento";
  if (!datos.email.trim() || !datos.email.includes("@")) return "Escribe un correo válido";
  if (datos.contrasena.length < MIN_PASSWORD) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`;
  }
  if (datos.contrasena !== datos.confirmacion) return "Las dos contraseñas no coinciden";
  return null;
}
