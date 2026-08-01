import {
  Trash2,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCw,
  Info
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

export default function DeleteAccountForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    conjunto: "",
    detalles: "",
    website: "", // Honeypot
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.email ||
      !formData.telefono ||
      !formData.conjunto
    ) {
      alert("Por favor completa todos los campos obligatorios (*).");
      return;
    }
    if (!acceptedTerms) {
      alert("Por favor acepta la confirmación para iniciar el proceso de eliminación.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email.trim(),
        telefono: formData.telefono,
        conjunto: formData.conjunto,
        ayudaOp: "Eliminación de Cuenta",
        detalles: `Solicitud de eliminación de cuenta de residente. Comentarios/Razones: ${formData.detalles || 'Ninguno'}.`,
        website: formData.website
      };

      const response = await fetch(`${apiUrl}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al enviar la solicitud.");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      alert(error.message || "Ocurrió un error inesperado al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      conjunto: "",
      detalles: "",
      website: "",
    });
    setAcceptedTerms(false);
    setIsSubmitted(false);
  };

  return (
    <section className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Title and Intro */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-red-100 dark:bg-red-950/30 text-[#8A1C14] dark:text-red-500 rounded-2xl mb-2">
            <Trash2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Solicitud de Eliminación de Cuenta
          </h1>
          <div className="w-20 h-1.5 bg-[#8A1C14] dark:bg-red-600 mx-auto rounded-full" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-550 dark:text-zinc-450 font-light leading-relaxed pt-2">
            Aquí puedes solicitar la eliminación de tu cuenta de residente en **Copper App** y sus datos personales asociados.
          </p>
        </div>

        {/* Informative Block about Data Retention & Deletion */}
        <div className="bg-zinc-50 dark:bg-neutral-950 border border-zinc-150 dark:border-neutral-900 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-[#8A1C14] dark:text-red-500" />
            ¿Qué datos se eliminan y cuáles se conservan?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/10 border border-red-100/50 dark:border-red-950/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-650 dark:text-red-400 block">
                Datos que se eliminarán
              </span>
              <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                Toda la información personal ingresada en tu perfil:
              </p>
              <ul className="text-xs text-zinc-500 dark:text-zinc-400 list-disc pl-4 space-y-1">
                <li>Registro de Convivientes (Familiares y cohabitantes).</li>
                <li>Vehículos registrados a tu nombre.</li>
                <li>Mascotas asociadas a tu apartamento.</li>
                <li>Empleados de servicio pre-autorizados.</li>
                <li>Tu usuario y credenciales de acceso de Supabase Auth.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-100/50 dark:bg-neutral-900 border border-zinc-200/40 dark:border-neutral-850 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block">
                Datos que se conservarán
              </span>
              <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                Por motivos legales y contables (Ley de Propiedad Horizontal en Colombia):
              </p>
              <ul className="text-xs text-zinc-500 dark:text-zinc-400 list-disc pl-4 space-y-1">
                <li>Historial de recaudos y pagos de administración.</li>
                <li>Facturas y cobros emitidos a la unidad de vivienda.</li>
                <li>Cargos y saldos contables asociados al inmueble.</li>
              </ul>
              <p className="text-[10px] text-zinc-450 italic leading-snug pt-1">
                Estos datos son esenciales para la auditoría contable y se mantendrán vinculados al historial del apartamento, no a tu identidad personal.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-950/30 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Proceso de Eliminación Manual</h4>
              <p className="text-xs text-amber-700/90 dark:text-amber-500/80 leading-normal">
                Al enviar esta solicitud, el administrador de tu conjunto recibirá una notificación formal para proceder a la eliminación manual de tu perfil y la desactivación de tus credenciales en un plazo máximo de **5 días hábiles**.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-50 dark:bg-neutral-950 border border-zinc-100 dark:border-neutral-900 p-6 sm:p-10 rounded-3xl shadow-sm transition-all">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-2 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-display">
                Solicitud Recibida
              </h3>
              <div className="max-w-md mx-auto space-y-3">
                <p className="text-zinc-650 dark:text-zinc-300 text-sm font-light leading-relaxed">
                  Muchas gracias, <span className="font-bold text-neutral-900 dark:text-white">{formData.nombre} {formData.apellido}</span>. Hemos recibido tu solicitud para eliminar la cuenta asociada al correo <span className="font-semibold text-neutral-900 dark:text-white underline">{formData.email}</span>.
                </p>
                <p className="text-xs text-zinc-500 leading-normal">
                  Un administrador de tu conjunto residencial (<span className="font-medium">{formData.conjunto}</span>) procesará la baja en un plazo máximo de 5 días hábiles. Se te enviará un correo electrónico de confirmación una vez que el proceso se haya completado.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
                  Formulario de Solicitud
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                  Por favor proporciona los datos exactamente como están registrados en la aplicación para poder identificar tu cuenta.
                </p>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Nombre & Apellido */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                    Nombre <span className="text-[#8A1C14]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                    Apellido <span className="text-[#8A1C14]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Pérez"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  />
                </div>

                {/* Email & Telefono */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                    Correo electrónico registrado <span className="text-[#8A1C14]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                    Número de teléfono <span className="text-[#8A1C14]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="300 123 4567"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  />
                </div>

                {/* Nombre de Conjunto */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                    Nombre del conjunto residencial <span className="text-[#8A1C14]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Conjunto Residencial Almería"
                    value={formData.conjunto}
                    onChange={(e) => setFormData({ ...formData, conjunto: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  />
                </div>

              </div>

              {/* Textarea: Comentarios o Motivos (Opcional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                  Motivo de la solicitud o comentarios adicionales <span className="text-zinc-400">(Opcional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Por favor cuéntanos brevemente por qué deseas eliminar tu cuenta..."
                  value={formData.detalles}
                  onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                />
              </div>

              {/* Honeypot field (invisible to users, catches spam bots) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`h-5 w-5 rounded-full border-2 focus:outline-none flex items-center justify-center shrink-0 transition-all mt-0.5 ${acceptedTerms
                    ? "border-[#8A1C14] bg-[#8A1C14] text-white"
                    : "border-zinc-400 hover:border-[#8A1C14]"
                    }`}
                >
                  {acceptedTerms && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </button>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                  Acepto iniciar el trámite de eliminación de mi cuenta y entiendo la información descrita sobre el borrado de mis datos personales.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8A1C14] hover:bg-[#a1231a] active:bg-[#721710] text-white font-bold rounded-xl text-sm sm:text-base tracking-wide transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-current text-white" />
                      Enviar solicitud
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
