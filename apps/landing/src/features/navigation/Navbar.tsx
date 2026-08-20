import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { isDarkStore } from "../../stores/appStore";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = useStore(isDarkStore);

  const navLinks = [
    { name: "Sobre Nosotros", href: "#nosotros" },
    { name: "Funciones", href: "#funciones" },
    { name: "Beneficios", href: "#beneficios" },
    { name: "Precios", href: "#precios" },
    { name: "Contacto", href: "#contacto" },
  ];

  const handleToggleTheme = () => {
    isDarkStore.set(!isDark);
  };

  const handleOpenLogin = () => {
    const adminPanelUrl = import.meta.env.PUBLIC_ADMIN_PANEL_URL || "http://localhost:3001";
    window.location.href = `${adminPanelUrl}/login`;
  };

  // Antes solo hacía scroll al formulario de contacto: registrarse era, en la práctica,
  // escribirle a ventas. Ahora lleva al asistente de registro del panel.
  const handleOpenDemo = () => {
    const adminPanelUrl = import.meta.env.PUBLIC_ADMIN_PANEL_URL || "http://localhost:3001";
    window.location.href = `${adminPanelUrl}/registro`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-[#8A1C14]/10 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <Logo />
            </a>
          </div>
 
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-650 hover:text-[#8A1C14] dark:text-zinc-300 dark:hover:text-red-400 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={handleToggleTheme}
              className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-neutral-900 text-zinc-500 dark:text-zinc-400 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Login Link */}
            <button
              onClick={handleOpenLogin}
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#8A1C14] dark:hover:text-red-400 transition-colors duration-200 cursor-pointer"
            >
              Ingresar
            </button>

            {/* Register/Demo Button */}
            <button
              onClick={handleOpenDemo}
              className="flex items-center gap-2 bg-[#8A1C14] hover:bg-[#a1231a] active:bg-[#721710] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-red-900/10 hover:shadow-red-900/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Registrarse Ahora
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-neutral-900 text-zinc-500 dark:text-zinc-400 transition-colors duration-150"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-neutral-900 text-zinc-500 dark:text-zinc-400 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-neutral-900 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-neutral-900 dark:hover:text-white transition-all duration-150"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-neutral-900 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenLogin();
              }}
              className="flex justify-center items-center px-4 py-3 rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-neutral-900 cursor-pointer w-full text-center"
            >
              Ingresar
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenDemo();
              }}
              className="flex justify-center items-center gap-2 w-full bg-[#8A1C14] hover:bg-[#a1231a] text-white px-4 py-3 rounded-lg text-base font-semibold shadow-md"
            >
              Registrarse Ahora
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
