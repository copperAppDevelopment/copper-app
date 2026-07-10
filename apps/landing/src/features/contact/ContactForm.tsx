import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Building,
  Users,
  Shield,
  Send,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useStore } from "@nanostores/react";
import { selectedPlanStore } from "../../stores/appStore";
import CitySkyline from "../hero/CitySkyline";

export default function ContactForm() {
  const selectedPlan = useStore(selectedPlanStore);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    conjunto: "",
    ayudaOp: "",
    detalles: "",
    website: "", // Honeypot
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill form if selectedPlan is passed
  useEffect(() => {
    if (selectedPlan) {
      setFormData((prev) => ({
        ...prev,
        ayudaOp: "Adquirir plan",
        detalles: `Interés en adquirir el plan: ${selectedPlan}`,
      }));
    }
  }, [selectedPlan]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.email ||
      !formData.telefono ||
      !formData.conjunto ||
      !formData.ayudaOp ||
      !formData.detalles
    ) {
      alert("Por favor completa todos los campos obligatorios (*).");
      return;
    }
    if (!acceptedTerms) {
      alert("Por favor acepta la política de tratamiento de datos personales.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al enviar el formulario.");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      alert(error.message || "Ocurrió un error inesperado al enviar el formulario.");
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
      ayudaOp: "",
      detalles: "",
      website: "",
    });
    setAcceptedTerms(false);
    setIsSubmitted(false);
  };

  return (
    <section id="contacto" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Top Call to Action Banner representing the gorgeous community header */}
        <div className="bg-[#8A1C14] dark:bg-red-950/70 rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center text-white shadow-xl">
          {/* Silhouettes of buildings as vector deco background */}
          <div className="absolute inset-x-0 bottom-0 opacity-20 pointer-events-none select-none flex justify-center items-end translate-y-3">
            <CitySkyline variant="translucent-white" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              ¿Listo para Transformar tu Copropiedad?
            </h2>
            <p className="text-red-100/95 font-light text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Únete a cientos de copropiedades que ya están disfrutando de una gestión más eficiente con soporte 24/7 en Colombia.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <span className="bg-white/10 text-white font-medium px-4 py-1.5 rounded-full text-xs uppercase tracking-wider backdrop-blur-sm">
                Soporte de Implementación Incluido
              </span>
            </div>
          </div>
        </div>

        {/* Header Title with Crimson Underline matched to the image */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Contáctanos
          </h2>
          <div className="w-20 h-1.5 bg-[#8A1C14] dark:bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Core Layout Side-by-Side Area mirroring image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Block: Interactive Registration Form (2/3 width) */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-50 dark:bg-neutral-950 border border-zinc-100 dark:border-neutral-900 p-6 sm:p-10 rounded-3xl shadow-sm transition-all">

              {isSubmitted ? (
                /* Success screen */
                <div className="text-center py-12 space-y-6">
                  <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-2 animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-display">
                    ¡Mensaje Enviado con Éxito!
                  </h3>
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="text-zinc-650 dark:text-zinc-300 text-sm font-light leading-relaxed">
                      Muchas gracias, <span className="font-bold text-zinc-805 dark:text-white">{formData.nombre} {formData.apellido}</span>. Hemos recibido tus datos para el conjunto <span className="font-semibold text-zinc-805 dark:text-white">{formData.conjunto}</span>.
                    </p>
                    <p className="text-xs text-zinc-500 leading-normal">
                      Un asesor de Copper se comunicará contigo al teléfono <span className="font-medium text-zinc-800 dark:text-white">{formData.telefono}</span> o correo <span className="underline">{formData.email}</span> para brindarte toda la información en los próximos minutos.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                /* Interactive Form Fields mirroring layout */
                <form onSubmit={handleSubmit} className="space-y-6 text-left">

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-neutral-900 dark:text-white">
                      Envíanos un mensaje
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                      Completa todos los campos para una respuesta más rápida
                    </p>
                  </div>

                  {/* Fields Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Row 1: Nombre & Apellido */}
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

                    {/* Row 2: Email corporativo & Número de teléfono */}
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                        Email corporativo <span className="text-[#8A1C14]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nombre@empresa.com"
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

                    {/* Row 3: Nombre del conjunto & ¿En qué podemos ayudarte? */}
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                        Nombre del conjunto <span className="text-[#8A1C14]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Conjunto residencial...."
                        value={formData.conjunto}
                        onChange={(e) => setFormData({ ...formData, conjunto: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                        ¿En qué podemos ayudarte? <span className="text-[#8A1C14]">*</span>
                      </label>
                      <select
                        required
                        value={formData.ayudaOp}
                        onChange={(e) => setFormData({ ...formData, ayudaOp: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Solicitar demostración">Solicitar demostración</option>
                        <option value="Información de precios">Información de precios</option>
                        <option value="Alianzas comerciales">Alianzas comerciales</option>
                        <option value="Adquirir plan">Adquirir plan</option>
                      </select>
                    </div>

                  </div>

                  {/* Textarea: ¿Cómo puede ayudarte nuestro equipo? */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400">
                      ¿Cómo puede ayudarte nuestro equipo? <span className="text-[#8A1C14]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Ej. nombre del plan que vas a adquirir"
                      value={formData.detalles}
                      onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-[#8A1C14] dark:focus:border-red-500 outline-none transition-all placeholder:text-zinc-100 dark:placeholder:text-zinc-650"
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

                  {/* Circular selector and terms check row */}
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
                      Al marcar esta casilla y hacer clic en &quot;Enviar&quot;, aceptas la política de tratamiento de datos personales Habeas Data. Sus datos no serán compartidos con terceros.
                    </p>
                  </div>

                  {/* Submission Red Colored Button aligned to center-left */}
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
                          Enviar mensaje
                        </>
                      )}
                    </button>
                  </div>

                  {/* Required helper text */}
                  <div className="text-center">
                    <p className="text-xs text-zinc-400 font-light">
                      Los campos que tienen un asterisco (*) son obligatorios.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

          {/* Right Block: Double Stack Card column (1/3 width) */}
          <div className="lg:col-span-4 space-y-8">

            {/* Card 1: Informacion de contacto */}
            <div className="bg-zinc-50 dark:bg-neutral-950 border border-zinc-100 dark:border-neutral-900 p-6 rounded-3xl space-y-6">
              <h3 className="text-base font-bold text-zinc-800 dark:text-white capitalize tracking-wide border-b border-zinc-200/50 dark:border-neutral-900pb-3">
                Informacion de contacto
              </h3>

              <div className="space-y-4">
                {/* Teléfono */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-2xl text-[#8A1C14] dark:text-red-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs leading-relaxed">
                    <p className="font-bold text-zinc-800 dark:text-white">Teléfono</p>
                    <p className="text-zinc-600 dark:text-zinc-300 font-medium">+57 317 368 9836</p>
                    <p className="text-zinc-550 text-zinc-500">Lun - Vie: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-2xl text-[#8A1C14] dark:text-red-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs leading-relaxed">
                    <p className="font-bold text-zinc-800 dark:text-white">Email</p>
                    <p className="text-[#8A1C14] dark:text-red-400 font-semibold underline">info@copperapp.co</p>
                    <p className="text-zinc-550 text-zinc-500">Respuesta en 24 horas</p>
                  </div>
                </div>

                {/* Oficina */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-2xl text-[#8A1C14] dark:text-red-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs leading-relaxed">
                    <p className="font-bold text-zinc-800 dark:text-white">Oficina</p>
                    <p className="text-zinc-600 dark:text-zinc-300 font-medium">Cali, Colombia</p>
                    <p className="text-zinc-550 text-zinc-500">Calle 50 #9256 Valle del lili, Colombia</p>
                  </div>
                </div>

                {/* Horarios */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-2xl text-[#8A1C14] dark:text-red-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs leading-relaxed">
                    <p className="font-bold text-zinc-800 dark:text-white">Horarios</p>
                    <p className="text-zinc-600 dark:text-zinc-300 font-medium">Lun - Vie: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Nuestros servicios */}
            <div className="bg-zinc-50 dark:bg-neutral-950 border border-zinc-100 dark:border-neutral-900 p-6 rounded-3xl space-y-6">
              <h3 className="text-base font-bold text-zinc-800 dark:text-white capitalize tracking-wide border-b border-zinc-200/50 dark:border-neutral-900pb-3">
                Nuestros servicios
              </h3>

              <div className="space-y-4">
                {/* Gestión de Conjuntos */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-2xl text-[#8A1C14] dark:text-red-400 shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs leading-relaxed">
                    <p className="font-bold text-zinc-800 dark:text-white">Gestión de Conjuntos</p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Administración completa de propiedades residenciales
                    </p>
                  </div>
                </div>

                {/* Soporte a Residentes */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-2xl text-[#8A1C14] dark:text-red-400 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs leading-relaxed">
                    <p className="font-bold text-zinc-800 dark:text-white">Soporte a Residentes</p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Atención personalizada para todos los habitantes
                    </p>
                  </div>
                </div>

                {/* Seguridad y Privacidad */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-2xl text-[#8A1C14] dark:text-red-400 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs leading-relaxed">
                    <p className="font-bold text-zinc-800 dark:text-white">Seguridad y Privacidad</p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Protección de datos con los más altos estándares
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
