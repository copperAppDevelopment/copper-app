import type { MetadataRoute } from "next";

/**
 * Lo que hace instalable el panel. `start_url` es la raíz porque esa página ya redirige según
 * el rol y el conjunto seleccionado.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Copper - Panel Administrativo",
    short_name: "Copper",
    description: "Gestión integrada de copropiedades en Colombia",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "es",
    background_color: "#ffffff",
    // El `--color-brand` de globals.css.
    theme_color: "#8A1C14",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // El logo reducido: el original se sale de la zona segura y Android lo recortaría.
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
