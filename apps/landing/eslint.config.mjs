import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

/**
 * Por ahora solo vigila el tamaño de los archivos (ver «Convenciones de Código» en el README).
 * Se usan únicamente los parsers de TypeScript y Astro, sin reglas recomendadas: activarlas de
 * golpe llenaría el lint de avisos ajenos a esta regla.
 */
const maxLines = {
  "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
};

export default tseslint.config(
  { ignores: ["node_modules/", "dist/", ".astro/", ".vercel/"] },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    languageOptions: { parser: tseslint.parser },
    rules: maxLines,
  },
  // Solo el parser de Astro (`flat/base`), no sus reglas recomendadas.
  ...astro.configs["flat/base"],
  { files: ["**/*.astro"], rules: maxLines },
  {
    // Deuda heredada: ya superaban el límite cuando se activó la regla. Se quitan de esta lista
    // al dividirlos; no se agregan archivos nuevos.
    files: [
      "src/features/benefits/Benefits.tsx",
      "src/features/contact/ContactForm.tsx",
      "src/features/contact/DeleteAccountForm.tsx",
    ],
    rules: { "max-lines": "off" },
  },
);
